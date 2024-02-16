import socketio
from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
import redis
import database
import datetime as dt
import aioredis
import json

# redis_client = redis.Redis(host="localhost", port=6379, db=0)


redis = aioredis.Redis(host="localhost", port=6379)


# redis 연결
url = "redis://localhost:6379"
redis_manager = socketio.AsyncRedisManager(url)
sio = socketio.AsyncServer(
    async_mode="asgi", cors_allowed_origins=[], client_manager=redis_manager
)

# socket.io 서버 생성
app = FastAPI()
socket_app = socketio.ASGIApp(socketio_server=sio, socketio_path="sockets")
app.mount("/", app=socket_app)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 허용할 출처 목록
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메소드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)


# `socket.io` 이벤트 핸들러


# 서버와 소켓 연결 (대기상태로 만들기)
@sio.event
async def connect(sid, environ):
    print(f"Socket connected : {sid}")
    await sio.emit("connect_data", {"sid": sid})


# 배열이면 반복문 사용해야함
rooms = {}


@sio.event
async def join_room(sid, room_name):
    # room_name으로 생성된 방이 없다면
    if room_name not in rooms:
        # 값 배열 생성
        rooms[room_name] = {"users": []}

    # 방에 두 명 이상의 사용자가 있는지 확인
    if len(rooms[room_name]["users"]) >= 2:
        await sio.emit("error", f"{room_name} is full", to=sid)
        return

    # 사용자를 방에 추가하고 해당 방으로 입장
    rooms[room_name]["users"].append(sid)
    await sio.enter_room(sid, room_name)
    print(f"{sid} Enter Room")

    # 채팅방 정보를 클라이언트에게 전송 TODO : redis에서 뿌리도록 설정
    await sio.emit(
        "join_data",
        rooms,
        room=room_name,
    )

    await redis.set(f"room:{room_name}", str(rooms[room_name]))


messages = {
    # "room_name" : [{"sender" : asdfasdf, "message" : asdfksadfsad, "timestamp" : 20123.12414.14},{"sender" : asdfasdf, "message" : asdfksadfsad, "timestamp" : 20123.12414.14}, ...]
}


@sio.event
async def room_message(sid, data):
    print(data)
    if "message" in data:
        message = data["message"]
    else:
        return
    currentroom = data["room_name"]

    if not message or not currentroom:  # TODO : 클라이언트에서 이 에러를 처리하도록...
        raise HTTPException(
            status_code=400, detail="Message or room_name missing in request"
        )

    if currentroom not in messages:
        messages[currentroom] = []

    timestamp = dt.datetime.now().isoformat()
    new_message = {"sender": sid, "message": message, "timestamp": timestamp}
    messages[currentroom].append(new_message)

    await redis.rpush(
        f"messages:{currentroom}", json.dumps(new_message, ensure_ascii=False)
    )

    await sio.emit(
        "room_message_data",
        new_message,
    )


# 채팅 종료 버튼
@sio.event
async def leave_room(sid, room_name):
    if room_name in rooms and sid in rooms[room_name]["users"]:
        rooms[room_name]["users"].remove(sid)
        await sio.leave_room(sid, room_name)
        print(f"{sid} Left Room({room_name})")

        # 방이 빈 경우 삭제
        if not rooms[room_name]["users"]:
            del rooms[room_name]
            await sio.close_room(room_name)
            print(f"{room_name} is deleted.")

            await redis.delete(f"room:{room_name}")


@sio.event
async def disconnect(sid):
    print(f"Disconnected : {sid}")


# 메시지를 Redis에 저장합니다 (옵션).
# await redis_client.lrange(f"chat_history_{room_name}", message)


# 채팅 기록 조회
@app.get("/history/{room_name}")
async def get_history(room_name: str):
    history = await redis.lrange(f"messages:{room_name}", 0, -1)
    return history
