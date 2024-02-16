import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useStore } from "../utils/store";

export default function Test() {
  const [Messages, setMessages] = useState([]);
  const [Message, setMessage] = useState("");
  const {
    currentsocket,
    setCurrentSocket,
    random,
    setRandom,
    roomdata,
    setroomdata,
    currentsid,
    setCurrentSid,
  } = useStore();

  const socket = io("http://localhost:9000", {
    path: "/sockets",
  });

  socket.on("connect_data", (data) => {
    console.log(data);
  });

  const joinClick = () => {
    socket.emit("join_room", random);
    socket.on("join_data", (data) => {
      setroomdata(data);
      console.log(roomdata);
    });
  };

  const send_room_message = () => {
    socket.emit("room_message", Message);
    socket.on("room_message_data", (data) => {
      setMessages((prev) => [...prev, ...data]);
    });
  };

  const leaveClick = () => {
    socket.emit("leave_room", random);
  };

  useEffect(() => {}, []);
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send_room_message();
        }}
      >
        <input
          type="text"
          name="chat"
          value={Message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input type="submit" value="Send"></input>
      </form>
    </div>
  );
}
