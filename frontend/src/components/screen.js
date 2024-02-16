import { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { io } from "socket.io-client";
import uuid from "react-uuid";
import Chat from "./Chat";
import Ready from "./Ready";
import { useStore } from "../utils/store";
import { generateRandomNumber } from "../hooks/GenerateRandomNumber";

export default function Screen() {
  const {
    random,
    setRandom,
    roomdata,
    setroomdata,
    currentsocket,
    setCurrentSocket,
  } = useStore();

  const [isChatting, setIsChatting] = useState(false); // start <-> leave
  const socketRef = useRef();

  const joinClick = () => {
    currentsocket.emit("join_room", random);
    setIsChatting(true);
    currentsocket.on("join_data", (data) => {
      console.log(data);
    });
  };

  const leaveClick = () => {
    setIsChatting(false);
    currentsocket.emit("leave_room", random);
  };

  useEffect(() => {
    socketRef.current = io("http://localhost:9000", {
      path: "/sockets",
    });

    setCurrentSocket(socketRef.current);
    setRandom(generateRandomNumber());

    return () => {
      socketRef.current.close();
    };
  }, []);

  return (
    <div>
      <h1>스크린 컴포넌트</h1>
      <Button onClick={isChatting ? leaveClick : joinClick}>
        {isChatting ? "채팅 종료" : "채팅 시작"}
      </Button>
      {isChatting ? (
        <Chat isChatting={isChatting} setIsChatting={setIsChatting} />
      ) : (
        <Ready />
      )}
    </div>
  );
}
