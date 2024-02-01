import asyncio
from broadcaster import Broadcast
from datetime import datetime
from fastapi import FastAPI, WebSocket, status
from pydantic import BaseModel
from fastapi_socketio import SocketManager
from starlette.websockets import WebSocketDisconnect

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
):  # websocket으로 인자를 받고 자료형은 WebSocket이다.
    await websocket.accept()
    try:
        while True:  # 소켓이 열려있는 동안
            data = await websocket.receive_text()
            await websocket.send_text(f"사용자: {data}")
    except:
        WebSocketDisconnect
        await websocket.close()
