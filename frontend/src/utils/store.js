import { createStore } from "@reduxjs/toolkit";
const initialchatroom = [
  {
    id: 0,
    roomid: "",
    users: [{ user1: "", user2: "" }],
    createtime: "",
    leavetime: "",
  },
];

const users = [
  {
    sid: "sid",
    create: "create",
    leave: "",
    active: true,
  },
];
const state = "이건 상탯값";

// function reducer(state, action) {
//   switch (action.type) {
//     case "INCREASE":
//       return state + 1;
//   }
// }

// dispatch 함수
const increaseid = (id) => {
  return { type: "INCREASE", id };
};

const addroomid = (roomid) => {
  return { type: "ADDROOMID", roomid };
};

const addusers = (users) => {
  return { type: "ADDUSERS", users };
};

const createtime = (createtime) => {
  return { type: "CREATETIME", createtime };
};

const leavetime = (leavetime) => {
  return { type: "LEAVETIME", leavetime };
};

const addsid = () => {
  return { type: "ADDSID" };
};

const addcurrentroomid = () => {
  return { type: "ADDCHATROOMID", initialchatroom };
};

const chatmessages = () => {
  return { type: "ADDCHATMESSAGE" };
};

function chatroom_reducer(state = initialchatroom, action) {
  switch (action.type) {
    case "INCREASE":
      return {
        ...state,
        id: state.id + 1,
      };
    case "ADDROOMID":
      return {
        ...state,
        roomid: action.roomid,
      };
    case "ADDUSERS":
      return {
        ...state,
        users,
      };
    case "CREATETIME":
      return {
        ...state,
        createtime,
      };
    case "LEAVETIME":
      return {
        ...state,
        leavetime,
      };
    default:
      return state;
  }
}

export let store = createStore(chatroom_reducer);
