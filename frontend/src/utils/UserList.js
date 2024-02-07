import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export default function UserList() {
  const [users, setUser] = useState([]);

  const socket = io("http://localhost:8080", { path: "/sockets" });

  useEffect(() => {
    socket.on("connect", (data) => {
      return "hi";
    });

    socket.on("join", (data) => {
      socket.emit("join_room", (data) => {
        console.log(data);
      });
      // console.log(data);
    });

    socket.on("disconnect", (data) => {});

    return () => {
      socket.close();
    };
  }, []);

  const fetchuser = () => {
    console.log(users);
    const countActiveUsers = (users) => {
      console.log("활성 사용자 수를 세는 중...");
      return users.filter((user) => user.active).length();
    };
  };

  return (
    <div>
      유저리스트 컴포넌트
      {/* <b>{users[0].id}</b> */}
    </div>
  );
}
