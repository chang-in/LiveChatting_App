import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Structure from "./components/Structure";
import ChatRoom from "./components/ChatRoom";
import Chat from "./components/Chat";
import UserList from "./utils/UserList";
import Test from "./components/Test";
// import { store } from "./utils/store";

function App({ sidebarcontent, maincontent }) {
  return (
    // <Provider store={store}>
    <Structure
      sidebarcontent={<ChatRoom />}
      maincontent={
        // <UserList />
        <Test />
        // <Chat />
      }
    ></Structure>
    // </Provider>
  );
}

export default App;
