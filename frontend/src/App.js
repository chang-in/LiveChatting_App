import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Structure from "./components/Structure";
import ChatRoom from "./components/ChatRoom";
import Chat from "./components/Chat";
import UserList from "./utils/UserList";
import Test from "./components/Test";
import First from "./components/Start";
import Screen from "./components/Screen";
import { useStore } from "./utils/store";

function App({ sidebarcontent, maincontent }) {
  const { roomdata } = useStore();

  return (
    <Structure sidebarcontent={<ChatRoom />} maincontent={<Screen />}>
      <Routes>
        <Route path="/" element={<Screen />} />
        <Route path={`/history/${roomdata}`} element={<Chat />} />
      </Routes>
    </Structure>
  );
}

export default App;
