import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Socket.IO 클라이언트 생성
    const newSocket = io(
      "https://jubilant-fishstick-wxq67v5j9vrf5xqr-8000.app.github.dev/socketio"
    );

    // 연결 이벤트 리스너
    newSocket.on("connect", () => {
      console.log("서버에 연결되었습니다.");
    });

    // 연결 해제 이벤트 리스너
    newSocket.on("disconnect", () => {
      console.log("서버와의 연결이 끊어졌습니다.");
    });

    setSocket(newSocket);

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>FastAPI와 Socket.IO 연결 예제</h1>
      {socket ? <p>서버에 연결되었습니다.</p> : <p>서버에 연결 중...</p>}
    </div>
  );
};

export default App;
