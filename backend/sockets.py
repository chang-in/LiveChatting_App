import socketio
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import redis
import database
import datetime as dt

redis_client = redis.Redis(host="localhost", port=6379, db=0)

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

# 채팅방 정보
rooms = [
    {
        "room_name": "room1",
        "users": ["sid", "sid2"],
        "messages": {"sid": ["", ""], "sid2": ["", ""]},
    },
    {
        "room_name": "room1",
        "users": ["sid", "sid2"],
        "messages": {"sid": ["", ""], "sid2": ["", ""]},
    },
]

# for i in rooms:
#     if sid in i["users"]:
#         print(i["users"])

users = [
    {
        "sid": "",
        "create": "",
        "leave": "",
        "active": None,
    },
    {
        "sid": "sid",
        "create": "create",
        "leave": "",
        "active": True,
    },
]

# `socket.io` 이벤트 핸들러


# 서버와 소켓 연결 (대기상태로 만들기)
@sio.event
async def connect(sid, environ):
    print(f"Socket connected : {sid}")
    users.append(
        {
            "sid": sid,
            "create": dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "active": True,
            "leave": None,
        }
    )
    await sio.emit("connect_message", {"sid": sid, "users": users})


# 채팅 시작 버튼 눌렀을 때
@sio.event
async def handle_join_room(sid, room_name):
    # users 배열과 rooms 배열에 값 업데이트
    for i in users:  # users 배열 순회
        if i["active"]:  # 채팅방 개설이 가능하다면 ~
            for j in rooms:  # rooms에 user의 sid를 집어넣기 위한 순회
                if len(j["users"]) < 2:  # user가 두명이 안채워졌다면
                    j["users"].append(i["sid"])  # 현재 순회중인 rooms 객체의 users에 추가
                    i.update({"active": False})  # users 배열에 채팅이 불가능한 상태로 변환
                    # continue 문은 필요 없습니다. 다음 루프로 넘어가는 것이 아니라, 이 루프를 종료하고 다음 사용자를 확인해야 합니다.
                    break
                elif len(j["users"]) == 2:
                    # j 객체에 room_name과 create를 업데이트합니다.
                    j.update(
                        {
                            "room_name": room_name,
                            "create": dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        }
                    )
                    await sio.enter_room(sid, room_name)
                    # 특정 방의 정보만 클라이언트에게 보냅니다.
                    await sio.emit("join_room", {"room_data": j}, room=room_name)
                else:
                    continue


# @sio.event
# async def message(sid, message):
#     await sio.emit("message", {"sid": sid, "message": message})


# 채팅 종료 버튼 => 방 정보에서만 나가짐, 방이 사라지는건 아님. TODO : 그러면 방에 아무도 없다면 방 자체를 삭제하도록 하자.
@sio.event
async def leave(sid, room_name):
    for i in rooms:
        if sid in i["users"]:
            i["users"].remove(sid)
            await sio.leave_room(sid, room_name)
            i.update({"leave": dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")})
            if len(i["users"]) == 0:  # 방에 아무도 없다면
                rooms.remove(i)  # 방을 삭제
            break
        else:
            continue


# users 배열에 sid가 일치하면 객체 싹다 삭제
@sio.event
async def disconnect(sid):
    for i in users:
        if i["sid"] == sid:
            users.remove(i)
            break
    print("disconnect : ", sid)


@sio.event
async def send_room_message(sid, message):
    # 메세지를 보낸 것을 클라이언트로 받으면 배열에 저장
    print("message: ", message)
    # 메세지 저장 위해 messages 객체를 찾기 위해 rooms 루프 돌기
    for i in rooms:
        # 일단 순회한 객체에 현재 sid가 있으면 멈춤.
        if sid in i["users"]:
            # 메세지 추가(append)
            # if sid not in i["messages"]:
            #     i["messages"][sid] = []
            i["messages"][sid].insert(0, message)
            sio.emit(
                "room_message",
                # rooms
                {"room": i["room_name"], "messages": i["messages"]},
                # room=i["room_name"],
            )
            continue
    # 메시지를 채팅방의 모든 구독자에게 브로드캐스트합니다.

    # 메시지를 Redis에 저장합니다 (옵션).
    # await redis_client.lrange(f"chat_history_{room_name}", message)


# 채팅 기록 조회
@app.get("/history/{room_name}")
async def get_history(room_name: str):
    history = await redis_client.lrange(f"chat_history_{room_name}", 0, -1)
    return history
