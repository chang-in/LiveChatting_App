import socketio
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# socket.io 서버 생성
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=[])
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


@app.get("/")
async def read_main():
    return {"message": "hello world"}


# `socket.io` 이벤트 핸들러
@sio.event
async def connect(sid, environ):
    print(f"{sid} : connected")
    await sio.emit("join", {"sid": sid})


@sio.event
async def message(sid, message):
    await sio.emit("message", {"sid": sid, "message": message})


@sio.event
async def disconnect(sid):
    print("disconnect ", sid)


@sio.event
async def join(sid, message):
    sio.enter_room(sid, "test_room")
    await sio.emit("room_join", {"data": "Entered room: " + "test_room"}, room=sid)
