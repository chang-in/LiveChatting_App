export const Message = ({ message }) => {
  if (message.type === "join") return <p>{`${message.sid} just joined`}</p>;
  if (message.type === "message")
    return (
      <p
        className={message.sender}
      >{`${message.sender}: ${message.message}`}</p>
    );
};
