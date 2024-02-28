import { create } from "zustand";

export const useStore = create((set) => ({
  roomdata: 0,
  setroomdata: (newRoomdata) => set({ roomdata: newRoomdata }),
  random: 0,
  setRandom: (newNumber) => set({ random: newNumber }),
  currentsocket: null,
  setCurrentSocket: (newSocket) => set({ currentsocket: newSocket }),
  currentsid: null,
  setCurrentSid: (newsid) => set({ currentsid: newsid }),
  messaging: "",
  setMessaging: (newmessage) => set({ messaging: newmessage }),
}));
