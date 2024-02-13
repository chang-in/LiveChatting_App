import { Link, Routes, Route } from "react-router-dom";
import { useStore } from "../utils/store";

export default function ChatRoom() {
  const { roomdata } = useStore();
  return (
    <div>
      <Link to={`/history/${roomdata}`}>{roomdata}번 채팅방 이동</Link>
    </div>
  );
}
