from fastapi import FastAPI
import socketio
import uvicorn

# create a Socket.IO server
sio = socketio.AsyncServer()
app = FastAPI()

# FastAPI에 대한 라우팅 설정
@app.get("/")
async def index():
    return {"message": "Hello, FastAPI with Socket.IO"}

# Socket.IO 이벤트 핸들러 설정
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

# FastAPI 앱과 Socket.IO 서버 결합
app = socketio.ASGIApp(sio, app)

# Uvicorn 서버 실행
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
