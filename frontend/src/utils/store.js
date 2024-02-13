import { create } from "zustand";

export const useStore = create((set) => ({
  roomdata: "",
  setroomdata: (newRoomdata) => set({ roomdata: newRoomdata }),
  random: 0,
  setRandom: (newNumber) => set({ random: newNumber }),
  currentsocket: null,
  setCurrentSocket: (newSocket) => set({ currentsocket: newSocket }),
}));
