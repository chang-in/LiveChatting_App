import { Link } from "react-router-dom";

export default function ChatRoom({ room }) {
  return (
    <div>
      <Link to="current_chat_room">{room}</Link>
    </div>
  );
}
