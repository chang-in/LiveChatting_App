import React, { useState, useEffect } from "react";

function Chat() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  // 웹소켓 연결 열기
  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8000/ws");
    setSocket(newSocket);

    newSocket.addEventListener("open", (event) => {
      console.log("WebSocket connection opened.");
    });

    newSocket.addEventListener("message", (event) => {
      // 서버로부터 메시지를 받으면 상태 업데이트
      addMessage(event.data, "server");
    });

    // 컴포넌트 언마운트 시 웹소켓 연결 닫기
    return () => {
      newSocket.close();
    };
  }, []);

  // 메시지 추가 함수
  const addMessage = (message, sender) => {
    setMessages((prevMessages) => [...prevMessages, { message, sender }]);
  };

  // 폼 제출 핸들러
  const handleSubmit = (event) => {
    event.preventDefault();
    const message = event.target.message.value;
    addMessage(message, "client");
    socket.send(message);
    event.target.reset();
  };

  return (
    <div>
      <form id="form" onSubmit={handleSubmit}>
        <input type="text" id="message" />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((msg, index) => (
          <li key={index} className={msg.sender}>
            {msg.sender}: {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Chat;
