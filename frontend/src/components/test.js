import { useEffect, useState, useRef } from "react";
import { Form, Input, Button } from "antd";
import { Message } from "./Message";

import { io } from "socket.io-client";
import ChatRoom from "./ChatRoom";
import uuid from "react-uuid";

export default function Test() {
  const socket = io("http://localhost:9000", { path: "/sockets" });
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentRoominfo, setRoominfo] = useState("");
  const [form] = Form.useForm();
  const ref = useRef();
  const room_data = {};

  useEffect(() => {
    // 컴포넌트가 마운트되면 대기상태로 준비되어야 할 것들.

    socket.on("connect", (data) => {
      setIsConnected(socket.connected);
      socket.on("connect_message", (data) => console.log(data));
    });

    socket.emit("send_room_message", messages);
    socket.on("room_message", (data) => {
      console.log(data);
      // setMessages((prev) => [...prev, { ...data }]);
    });

    // 서버와의 연결 끊김
    socket.on("disconnect", (data) => {
      console.log("서버와의 연결이 종료됩니다");
    });

    return () => {
      socket.close();
    };
  }, []);

  const on_join_click = () => {
    ref.current = uuid();
    socket.emit("handle_join_room", ref.current); // 방을 생성하기 위해 해당 컴포넌트(생성될 방 이름) 서버에 전달
    socket.on("join_room", (data) => {
      console.log(data);
    });
  };

  const on_leave_click = () => {
    socket.emit("leave", ref.current);
    console.log("방을 나갑니다.");
    // socket.on("left_room", (data) => {
    //   console.log("방을 나갑니다");
    // });
  };

  const onFinish = (values) => {
    const { chat } = values;
    setMessages((prev) => [...prev, { ...chat }]);
    console.log(chat);
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
      <h1>컴포넌트 ID : {ref.current}</h1>
      {/* <ChatRoom room={ref.current} />; */}
      <div className="content">
        <h2>status : {isConnected ? "connect" : "disconnect"}</h2>
        {messages.map((msg, index) => (
          <Message message={msg} {...messages.message} key={index} />
        ))}
      </div>
      <Button type="primary" htmlType="button" onClick={on_join_click}>
        채팅 시작
      </Button>
      <Button type="primary" htmlType="button" onClick={on_leave_click}>
        채팅 종료
      </Button>
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
