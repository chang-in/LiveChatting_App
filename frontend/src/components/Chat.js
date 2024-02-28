import { useEffect, useState } from "react";
import { Form } from "antd";
import { useStore } from "../utils/store";
import ChatInput from "./ChatInput";

export default function Chat({ isChatting, setIsChatting }) {
  const [messages, setMessages] = useState([]);
  const [form] = Form.useForm();
  const {
    currentsocket,
    setCurrentSocket,
    random,
    setRandom,
    roomdata,
    setroomdata,
    messaging,
  } = useStore();

  const joinNewRoom = () => {
    const newNumber = Math.floor(Math.random() * 10) + 1;
    currentsocket.emit("leave_room", random);
    currentsocket.emit("join_room", newNumber);
    setRandom(newNumber);
  };

  useEffect(() => {
    if (isChatting) {
      currentsocket.emit("join_room", random);

      const alertListener = (data) => console.log(random, "입장 완료.");
      currentsocket.on("alert", alertListener);

      const errorListener = (data) => {
        if (data.includes("is full")) {
          console.log(data);
          joinNewRoom();
        }
      };
      currentsocket.on("error", errorListener);

      const messageListener = (data) => {
        // console.log(data);
        setMessages((prev) => [...prev, data]);
      };
      currentsocket.on("room_message_data", messageListener);

      return () => {
        currentsocket.emit("leave_room", random);
        currentsocket.off("alert", alertListener);
        currentsocket.off("error", errorListener);
        currentsocket.off("room_message_data", messageListener);
      };
    }
  }, []);

  return (
    <>
      <div className="content">
        {<div>{messaging ? <span>{messaging}</span> : null}</div>}
        {messages.map((msg, index) => {
          const regex =
            /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
          const current = msg.message.match(regex);
          if (current) {
            return (
              <span
                key={index}
                className={msg.sender === currentsocket.id ? "나" : "상대"}
              >
                <iframe
                  title={`YouTube Video ${index}`}
                  width="350"
                  height="185"
                  src={`https://www.youtube.com/embed/${current[7]}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; "
                  allowFullScreen
                ></iframe>
              </span>
            );
          } else {
            return (
              <span
                key={index}
                className={msg.sender === currentsocket.id ? "나" : "상대"}
              >
                {msg.message}
              </span>
            );
          }
        })}
      </div>
      <ChatInput isChatting={isChatting} setIsChatting={setIsChatting} />
    </>
  );
}
