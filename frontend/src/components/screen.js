import { Message } from "./Message";

export default function Screen({ messages }) {
  return (
    <>
      {messages.map((msg, index) => (
        <Message message={msg} {...messages} key={index} />
      ))}
    </>
  );
}
