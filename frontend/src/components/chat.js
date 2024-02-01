import React, { useState, useEffect } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8000/ws");
    newSocket.addEventListener("message", (event) => {
      addMessage(event.data, "server");
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const addMessage = (message, sender) => {
    setMessages((prevMessages) => [...prevMessages, { sender, message }]);
  };

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
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            {msg.sender}: {msg.message}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Chat;
