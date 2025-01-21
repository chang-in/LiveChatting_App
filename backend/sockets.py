# import socketio
# from fastapi import FastAPI
# from starlette.middleware.cors import CORSMiddleware
# import datetime as dt
# import json
# from redis import asyncio as aioredis
# from dotenv import load_dotenv
# import os

# load_dotenv()

# # redis 연결
# redis = aioredis.Redis(host=os.getenv("redis_host"), port=os.getenv("redis_port"))
# redis_manager = socketio.AsyncRedisManager()

# sio = socketio.AsyncServer(
#     async_mode="asgi", cors_allowed_origins=[], client_manager=redis_manager
# )

# # socket.io 서버 생성
# app = FastAPI()
# socket_app = socketio.ASGIApp(socketio_server=sio, socketio_path="sockets")
# app.mount("/sockets", app=socket_app)


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # 허용할 출처 목록
#     allow_credentials=True,
#     allow_methods=["*"],  # 모든 HTTP 메소드 허용
#     allow_headers=["*"],  # 모든 HTTP 헤더 허용
# )


# # `socket.io` 이벤트 핸들러
# # 서버와 소켓 연결 (대기상태로 만들기)
# @sio.event
# async def connect(sid, environ):
#     print(f"Socket connected : {sid}")


# # 배열이면 반복문 사용해야함
# roomid = None
# decode_room = None


# @sio.event
# async def join_room(sid, room_name):
#     global decode_room
#     global roomid
#     roomid = room_name
#     redis_room = await redis.lrange(f"room:{room_name}:users", 0, -1)
#     decode_room = [i.decode("utf-8") for i in redis_room]

#     if len(decode_room) >= 2:
#         await sio.emit("error", f"{room_name} is full.")
#         return
#     else:
#         await sio.enter_room(sid, room_name)
#         print(f"Enter room {room_name}, {sid}")
#         await redis.lpush(f"room:{room_name}:users", sid)
#         await sio.emit("alert", f"방 입장 완료: {room_name}, {sid}")


# @sio.event
# async def room_message(sid, data):
#     if "message" in data:
#         message = data["message"]
#     else:
#         return
#     currentroom = data["room_name"]

#     timestamp = dt.datetime.now().isoformat()
#     new_message = {"sender": sid, "message": message, "timestamp": timestamp}

#     await redis.rpush(
#         f"messages:{currentroom}",
#         json.dumps(new_message, ensure_ascii=False),
#     )

#     await sio.emit("room_message_data", new_message, room=currentroom)


# @sio.event
# async def leave_room(sid, room_name):
#     await sio.leave_room(sid, room_name)
#     await redis.lrem(f"room:{room_name}:users", 0, sid)
#     await redis.lrem(f"messages:{room_name}:sid", 0, sid)
#     print(f"leave room {room_name}, {sid}")

#     if not decode_room:
#         await sio.close_room(room_name)
#         print(f"close room {room_name}")
#         await redis.delete(f"room:{room_name}:users")
#         await redis.delete(f"messages:{room_name}")
#         print(f"delete room {room_name}")


# @sio.event
# async def disconnect(sid):
#     print(f"Disconnected : {sid}")

import socketio
import redis

# Redis 클라이언트 생성
# redis_client = redis.Redis(host='redis://13.124.221.180', port=6379, db=0)

# # SocketIO 서버 생성
# sio = socketio.Server(async_mode='threading')
# app = socketio.WSGIApp(sio)

mgr = socketio.AsyncRedisManager('redis://13.124.221.180:6379')
sio = socketio.AsyncServer(client_manager=mgr)

@sio.event
def connect(sid, environ):
    print('클라이언트 연결됨:', sid)
    
    # Redis에 연결 상태 저장
    mgr.redis.set(f'user:{sid}', 'connected')

@sio.event
def disconnect(sid):
    print('클라이언트 연결 해제됨:', sid)
    
    # Redis에서 연결 상태 제거
    mgr.redis.delete(f'user:{sid}')

@sio.event
def message(sid, data):
    print('메시지 수신:', data)
    
    # Redis에 메시지 저장
    mgr.redis.lpush('messages', str(data))
    
    # 클라이언트에게 응답
    return 'Message received!'

# if __name__ == '__main__':
#     import eventlet
#     eventlet.wsgi.server(eventlet.listen(('', 8000)), app)
