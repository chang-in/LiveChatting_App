import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { path: "/sockets" });

export default function Socketio() {
  const [isConnected, setIsConnected] = useState(false);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.on("join", (data) => {
      const { Sid } = data;
      const newMessage = {
        data,
        type: "join",
      };
      setMessages([...messages, newMessage]);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [messages]);

  return (
    <div>
      <h2>Status: {isConnected ? "Connected" : "Disconnected"}</h2>
      {/* Chat UI components */}
    </div>
  );
}
