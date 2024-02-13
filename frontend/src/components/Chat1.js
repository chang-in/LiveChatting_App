import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Form, Input, Button } from "antd";
import { Message } from "./Message";
import Screen from "./Screen";
const socket = io(process.env.REACT_APP_API_URL, {
  path: process.env.REACT_APP_SOCKET_PATH,
});

export default function Chat1() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [user, setUser] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [form] = Form.useForm();
  const [usrcount, setUsrcount] = useState(0);
  const [rooms, setRoom] = useState([]);

  useEffect(() => {
    // 소켓에 연결되면 실행
    socket.on("connect", () => {
      setIsConnected(socket.connected);
    });

    socket.on("join", (data) => {
      setUser(() => [
        {
          ...data,
          type: "join",
          id: data.sid === socket.id ? 1 : 2,
          sender: data.sid === socket.id ? "나" : "상대",
        },
      ]);
      setUsrcount(usrcount + 1);
    });

    // socket.on("join_room", (data) => {
    //   console.log(data);
    // });

    socket.on("message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          type: "message",
          sender: data.sid === socket.id ? "나" : "상대",
        },
      ]);
      // console.log("messages : ", messages);
    });

    socket.on("disconnect", (sid) => {
      // setUser((prev) => prev.filter((user) => user.sid !== sid));
      setUsrcount(usrcount - 1);
      setIsConnected(socket.connected);
    });

    // console.log(messages);
    return () => {
      socket.close();
    };
  }, []);

  // user.map((data, index) => console.log(data));
  // console.log(user);

  const onFinish = (values) => {
    const { chat } = values;
    // setMessages(prevchat.trim());
    socket.emit("message", chat);
    // console.log(messages);
    form.resetFields();
    scrollToBottom();
  };

  const scrollToBottom = () => {
    const chatDisplay = document.querySelector(".content");
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
  };

  // const countusr = () => {
  //   for (const s of user) {
  //     setCountuser(countuser + 1);
  //   }
  //   return countuser;
  // };

  // countusr();

  return (
    <div>
      <div className="content">
        <h2>status : {isConnected ? "connect" : "disconnect"}</h2>
        <p>유저 수 : {usrcount}</p>
        <Screen messages={messages} />
      </div>
      <Form form={form} onFinish={onFinish} autoComplete="off">
        <Form.Item name="chat">
          <Input
            onChange={(e) => {
              const value = e.target.value;
              setMessage(value);
              // console.log(message);
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
