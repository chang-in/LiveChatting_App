import { create } from "zustand";
import { Socket } from "socket.io-client";

interface StoreState {
  roomdata: number;
  setroomdata: (newRoomdata: number) => void;
  random: number;
  setRandom: (newNumber: number) => void;
  currentsocket: Socket | null;
  setCurrentSocket: (newSocket: Socket) => void;
  currentsid: string | null;
  setCurrentSid: (newsid: string) => void;
  messaging: string;
  setMessaging: (newmessage: string) => void;
}

export const useStore = create<StoreState>((set) => ({
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
