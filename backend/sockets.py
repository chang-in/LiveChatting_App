import socketio
from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
import redis
import database
import datetime as dt
import aioredis

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


room = {}


# 채팅 시작 버튼 눌렀을 때 sid는 본인
@sio.event
async def join_room(sid, room_name):
    if room_name not in room:
        room[room_name] = []

    # 방에 두 명 이상의 사용자가 있는지 확인
    if len(room[room_name]) >= 2:
        await sio.emit("error", f"{room_name} is full", to=sid)
        return

    # 사용자를 방에 추가하고 해당 방으로 입장
    room[room_name].append(sid)
    await sio.enter_room(sid, room_name)

    # 채팅방 정보를 클라이언트에게 전송
    await sio.emit(
        "room_data", {"room_id": room_name, "users": room[room_name]}, room=room_name
    )

    await redis.set(f"room:{room_name}", str(room[room_name]))


messages = {}


@sio.event
async def send_room_message(sid, data):
    if "message" in data:
        message = data["message"]
    else:
        return
    room_name = data["room_name"]

    if not message or not room_name:
        raise HTTPException(
            status_code=400, detail="Message or room_name missing in request"
        )

    if room_name not in messages:
        messages[room_name] = []

    messages[room_name].append(
        {"sender": sid, "message": message, "timestamp": dt.datetime.now().isoformat()}
    )
    await sio.emit("room_message", messages[room_name])

    await redis.rpush(f"messages:{room_name}", message)


# 채팅 종료 버튼
@sio.event
async def leave(sid, room_name):
    if room_name in room and sid in room[room_name]:
        room[room_name].remove(sid)
        await sio.leave_room(sid, room_name)

        # 방이 빈 경우 삭제
        if not room[room_name]:
            del room[room_name]
            await sio.close_room(room_name)

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
