import { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { io } from "socket.io-client";
import Chat from "./Chat";
import Ready from "./Ready";
import { useStore } from "../utils/store";
import { generateRandomNumber } from "../hooks/GenerateRandomNumber";

export default function Screen() {
  const {
    random,
    setRandom,
    //   roomdata,
    //   setroomdata,
    currentsocket,
    setCurrentSocket,
  } = useStore();
  const socketRef = useRef();

  const [isChatting, setIsChatting] = useState(false); // start <-> leave

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_API_URL, {
      path: process.env.SOCKET_PATH,
    });

    setCurrentSocket(socketRef.current);

    socketRef.current.on("connect", (data) => {
      // console.log("서버와 연결");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const joinClick = () => {
    socketRef.current.connect();
    setRandom(generateRandomNumber());
    setIsChatting(true);
  };

  const leaveClick = () => {
    setIsChatting(false);
  };

  return (
    <div className="screen">
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
