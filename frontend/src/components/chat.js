import { useEffect, useState, useRef } from "react";
import { Form, Input, Button } from "antd";
import { Message } from "./Message";
import { useStore } from "../utils/store";
import { io } from "socket.io-client";
import { generateRandomNumber } from "../hooks/GenerateRandomNumber";
import ChatRoom from "./ChatRoom";
import uuid from "react-uuid";
import Screen from "./Screen";
import { NULL } from "node-sass";

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
    const socket = io("http://localhost:9000", {
      path: "/sockets",
    });
    setCurrentSocket(socket);

    // 소켓 서버와 연결 동시에 채팅 방 가입
    socket.on("connect", (data) => {
      setIsConnected(socket.connected);
      setroomdata(random);
      socket.emit("join_room", random); // 방을 생성하기 위해 해당 컴포넌트(생성될 방 이름) 서버에 전달
    });

    const joinRoom = (roomname) => {
      socket.emit("join_room", roomname);
    };

    // 에러 처리 -> 사용자 두명만 받을 수 있는 에러처리
    // socket.on("error", (errorMessage) => {
    //   console.log("에러 메세지 : ", errorMessage);

    //   if (errorMessage.includes("is full")) {
    //     setRandom(generateRandomNumber());
    //   }
    // });

    // 채팅 방 정보 수신
    socket.on("room_data", (data) => {
      console.log(data);
    });

    // 주고 받는 메세지 수신
    socket.on("room_message", (data) => {
      // for (let item of data) {
      //   item.sender === currentsocket.id
      //     ? setMessages((prev) => [...prev, { ...item }])
      //     : console.log("데이터 수신이 제대로 안됨");
      // }
      console.log(messages);
    });

    // 서버와의 연결 끊김(언마운트 or 새로고침)
    socket.on("disconnect", (data) => {
      console.log("서버와의 연결이 종료됩니다");
    });

    return () => {
      // 소켓 서버와의 연결 종료
      socket.close();
    };
  }, []);

  const onFinish = (values) => {
    const { chat } = values;
    // setMessage(chat);
    currentsocket.emit("send_room_message", {
      room_name: random,
      message: chat,
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
      <h1>status : {isConnected ? "true" : "false"}</h1>
      <h1>컴포넌트 ID : {random}</h1>
      {/* <ChatRoom room={ref.current} />; */}
      <div className="content">
        <h2>status : {isConnected ? "connect" : "disconnect"}</h2>
        {/* {messages.map((msg, index) => (
          <Message message={msg} {...messages.message} key={index} />
        ))} */}
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
