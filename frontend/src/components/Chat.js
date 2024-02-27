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

      const alertListener = (data) => console.log(data);
      currentsocket.on("alert", alertListener);

      const errorListener = (data) => {
        if (data.includes("is full")) {
          console.log(data);
          joinNewRoom();
        }
      };
      currentsocket.on("error", errorListener);

      const messageListener = (data) => {
        console.log(data);
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
        {messages.map((msg, index) => {
          const regex =
            /(?:http:|https:)?(\/\/)?(www\.)?(youtube.com|youtu.be|youtube-nocookie)\/(watch|embed)?(\?v=|\/)?([a-zA-Z0-9_-]{11})?/g;
          const current = msg.message.match(regex);
          if (current) {
            return (
              <div
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
              </div>
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
