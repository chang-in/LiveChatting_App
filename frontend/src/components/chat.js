import { useEffect, useState, useRef } from "react";
import { Form, Input, Button } from "antd";
import { Message } from "./Message";
import { useStore } from "../utils/store";
import { io } from "socket.io-client";
import { generateRandomNumber } from "../hooks/GenerateRandomNumber";
import ChatRoom from "./ChatRoom";
import uuid from "react-uuid";
import Screen from "./Screen";

export default function Chat({ isChatting, setIsChatting }) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [form] = Form.useForm();
  const {
    currentsocket,
    setCurrentSocket,
    random,
    setRandom,
    roomdata,
    setroomdata,
  } = useStore();

  useEffect(() => {
    console.log(currentsocket.id);

    currentsocket.on("room_message_data", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // 에러 처리 -> 사용자 두명만 받을 수 있는 에러처리
    // const error = () => {
    //   currentsocket.on("error", (errorMessage) => {
    //     console.log("에러 메세지 : ", errorMessage);

    //     if (errorMessage.includes("is full")) {
    //       setRandom(generateRandomNumber());
    //       joinRoom(random);
    //     }
    //   });
    // };
    // 채팅 방 정보 수신

    return () => {
      currentsocket.emit("leave_room", random);
    };
  }, []);
  console.log(messages);
  const onFinish = (values) => {
    const { chat } = values;
    let timestamp = new Date().toISOString();
    currentsocket.emit("room_message", {
      room_name: random,
      sender: currentsocket.id,
      message: chat,
      timestamp: timestamp,
    });
    form.resetFields();
    scrollToBottom();
  };

  const scrollToBottom = () => {
    const chatDisplay = document.querySelector(".content");
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
  };

  return (
    <div>
      <h1>status : {currentsocket.connected ? "true" : "false"}</h1>
      <h1>컴포넌트 ID : {random}</h1>
      {/* <h1>현재 sid : {currentsid}</h1> */}
      {/* <ChatRoom room={ref.current} />; */}
      <div className="content">
        {messages.map((msg, index) =>
          msg.sender === currentsocket.id ? (
            <p className={"나"} key={index}>
              {msg.message}
            </p>
          ) : (
            <p className={"상대"} key={index}>
              {msg.message}
            </p>
          )
        )}
      </div>

      <Form form={form} onFinish={onFinish} autoComplete="off">
        <Form.Item name="chat">
          <Input
            onChange={(e) => {
              e.target.value
                ? console.log("입력중...")
                : console.log("채팅을 입력하세요");
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            보내기
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
