import { Button, Form, Input } from "antd";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [form] = useForm();

  const onFinish = (values) => {
    const { chat } = values;
    setMessages((prev) => [...prev, { 창인: chat }]);
    scrollToBottom();
    // console.log(messages);
    form.resetFields();
  };

  const scrollToBottom = () => {
    const chatdisplay = document.querySelector(".content");
    chatdisplay.scrollTop = chatdisplay.scrollHeight;
  };

  return (
    <>
      <div className="content">
        {messages.map((item, index) => (
          <ul key={index}>
            <li
              style={{
                listStyleType: "none",
                marginRight: "10px",
                alignItems: "center",
                justifyContent: "center",
              }}
              key={index}
            >
              {item.창인} :{" "}
              <img
                style={{
                  border: "1px solid",
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                }}
                src={
                  "https://img.khan.co.kr/news/2017/08/22/l_2017082301002927300235691.jpg"
                }
                alt={"아이콘"}
              />
            </li>
          </ul>
        ))}
      </div>
      <Form
        form={form}
        className="input"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item name="chat">
          <Input style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Button
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
