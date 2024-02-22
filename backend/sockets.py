import socketio
from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
import database
import datetime as dt
import json
import aioredis

# import redis as rd

# redis 연결
url = "redis://localhost:6379"
redis = aioredis.Redis()

# redis_other = rd.Redis()
# redis_manager = socketio.AsyncRedisManager(url)
# sio = socketio.AsyncServer(
#     async_mode="asgi", cors_allowed_origins=[], client_manager=redis_manager
# )

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=[])
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


# # 배열이면 반복문 사용해야함
roomid = None
decode_room = None


@sio.event
async def join_room(sid, room_name):
    global decode_room
    global roomid
    roomid = room_name
    redis_room = await redis.lrange(f"room:{room_name}:users", 0, -1)
    decode_room = [i.decode("utf-8") for i in redis_room]

    if len(decode_room) >= 2:
        await sio.emit("error", f"{room_name} is full.")
        return
    else:
        await sio.enter_room(sid, room_name)
        print(f"Enter room {room_name}, {sid}")
        await redis.lpush(f"room:{room_name}:users", sid)
        await sio.emit("alert", f"방 입장 완료: {room_name}, {sid}")


@sio.event
async def room_message(sid, data):
    if "message" in data:
        message = data["message"]
    else:
        return
    currentroom = data["room_name"]

    timestamp = dt.datetime.now().isoformat()
    new_message = {"sender": sid, "message": message, "timestamp": timestamp}
    # messages[currentroom].append(new_message)

    await redis.rpush(
        f"messages:{currentroom}", json.dumps(new_message, ensure_ascii=False)
    )

    await sio.emit("room_message_data", new_message, room=currentroom)


# # 채팅 종료 버튼
# @sio.event
# async def leave_room(sid, room_name):
#     await redis.lrem(f"room:{room_name}:users", 0, sid)
#     await sio.leave_room(sid, room_name)

#     if len(decode_room) == 0:
#         await redis.delete(f"room:{room_name}")
#         await sio.close_room(room_name)
#         print(f"{sid} Left Room({room_name})")
#     # if room_name in rooms and sid in rooms[room_name]["users"]:

#     # 방이 빈 경우 삭제
#     # if not rooms[room_name]["users"]:
#     #     del rooms[room_name]
#     #     print(f"{room_name} is deleted.")
#     #     await redis.delete(f"room:{room_name}")


@sio.event
async def leave_room(sid, room_name):
    await sio.leave_room(sid, room_name)
    await redis.lrem(f"room:{room_name}:users", 0, sid)
    await redis.lrem(f"messages:{room_name}:sid", 0, sid)
    print(f"leave room {room_name}, {sid}")

    if not decode_room:
        await sio.close_room(room_name)
        print(f"close room {room_name}")
        await redis.delete(f"room:{room_name}:users")
        await redis.delete(f"messages:{room_name}")
        print(f"delete room {room_name}")


@sio.event
async def disconnect(sid):
    print(f"Disconnected : {sid}")
    # await redis_manager.redis.unsubscribe("socketio", f"LEAVE|{sid}")


# 메시지를 Redis에 저장합니다 (옵션).
# await redis_client.lrange(f"chat_history_{room_name}", message)


# # 채팅 기록 조회
# @app.get("/history/{room_name}")
# async def get_history(room_name: str):
#     history = await redis.lrange(f"messages:{room_name}", 0, -1)
#     return history
