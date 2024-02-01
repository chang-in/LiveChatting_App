import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000", { path: "/sockets" });

export default function Test() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", (data) => {
      console.log("connect :", data);
    });

    socket.on("disconnect", (data) => {
      console.log("disconnect : ", data);
    });

    socket.on("join", (data) => {
      console.log("join :", data);
    });

    socket.on("message", (data) => {
      console.log("message : ", data);
    });

    socket.emit("join", { room: "test_room" });

    socket.on("room_join", (data) => {
      console.log("room_join :", data);
    });
  }, []);

  return <div>챗 테스트 컴포넌트</div>;
}
