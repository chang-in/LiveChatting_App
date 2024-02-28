import React, { useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { useStore } from "../utils/store";

export default function ChatInput({ isChatting, setIsChatting }) {
  const [form] = Form.useForm();
  const [message, setMessage] = useState("");

  const {
    currentsocket,
    setCurrentSocket,
    random,
    setRandom,
    roomdata,
    setroomdata,
    setMessaging,
    messaging,
  } = useStore();

  const scrollToBottom = () => {
    const chatDisplay = document.querySelector(".content");
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
  };

  const onFinish = (values) => {
    const { chat } = values;
    let timestamp = new Date().toISOString();
    currentsocket.emit("room_message", {
      room_name: random,
      message: chat,
      timestamp: timestamp,
    });
    setMessaging("");
    form.resetFields();
    scrollToBottom();
  };

  return (
    <div className="input">
      <Form form={form} onFinish={onFinish} autoComplete="off">
        <Row align="middle" gutter={8} className="input">
          <Col flex="auto">
            <Form.Item name="chat">
              <Input
                onChange={(e) => {
                  e.target.value
                    ? setMessaging("입력 중...")
                    : setMessaging("");
                  // console.log(e.target);
                }}
                placeholder="채팅을 입력하세요"
              />
            </Form.Item>
          </Col>
          <Col flex="none">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                보내기
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
