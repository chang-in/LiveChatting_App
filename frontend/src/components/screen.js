import { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import uuid from "react-uuid";
import Chat from "./Chat";
import Ready from "./Ready";
import { useStore } from "../utils/store";
import { generateRandomNumber } from "../hooks/GenerateRandomNumber";

export default function Screen({ socket }) {
  const { random, setRandom, roomdata, setroomdata, currentsocket } =
    useStore();

  const [isChatting, setIsChatting] = useState(false); // start <-> leave

  const on_join_click = () => {
    setIsChatting(true);
  };

  useEffect(() => {
    setRandom(generateRandomNumber());
  }, []);

  //   const on_leave_click = () => {
  //     console.log("채팅방을 떠납니다.");
  //     setIsChatting(false);
  //   };

  const on_leave_click = () => {
    currentsocket.emit("leave", random);
    setIsChatting(false);
    console.log("방을 나갑니다.");
  };

  return (
    <div>
      <h1>스크린 컴포넌트</h1>
      <Button onClick={isChatting ? on_leave_click : on_join_click}>
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
