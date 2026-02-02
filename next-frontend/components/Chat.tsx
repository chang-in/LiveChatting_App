import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';

interface ChatProps {
  onLeave: () => void;
}

interface Message {
  sender: string;
  message: string;
  timestamp: string;
}

export default function Chat({ onLeave }: ChatProps) {
  const { currentsocket, random, setRandom } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const joinNewRoom = () => {
    const newNumber = Math.floor(Math.random() * 10) + 1;
    if (currentsocket) {
      currentsocket.emit("leave_room", random);
      currentsocket.emit("join_room", newNumber);
      setRandom(newNumber);
      setMessages([]); // Clear messages on room change? Original didn't seem to explicitly clear but maybe it should.
    }
  };

  useEffect(() => {
    if (currentsocket) {
      currentsocket.emit("join_room", random);

      const alertListener = (data: string) => console.log(random, "Entered.");
      currentsocket.on("alert", alertListener);

      const errorListener = (data: string) => {
        if (data.includes("is full")) {
          console.log(data);
          joinNewRoom();
        }
      };
      currentsocket.on("error", errorListener);

      const messageListener = (data: Message) => {
        setMessages((prev) => [...prev, data]);
        scrollToBottom();
      };
      currentsocket.on("room_message_data", messageListener);

      return () => {
        currentsocket.emit("leave_room", random);
        currentsocket.off("alert", alertListener);
        currentsocket.off("error", errorListener);
        currentsocket.off("room_message_data", messageListener);
      };
    }
  }, [currentsocket, random]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && currentsocket) {
      currentsocket.emit("room_message", {
        message: inputValue,
        room_name: random,
      });
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const renderMessageContent = (msg: Message) => {
    const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const current = msg.message.match(regex);
    if (current && current[7]) {
      return (
        <iframe
          title={`YouTube Video`}
          width="300"
          height="160"
          src={`https://www.youtube.com/embed/${current[7]}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        ></iframe>
      );
    } else {
      return msg.message;
    }
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-bold">Random Chat</h2>
                <button onClick={onLeave} className="text-sm text-red-500 hover:text-red-600 font-bold">Leave</button>
            </div>
            <div className="p-4">
                <div className="bg-slate-100 dark:bg-[#1c2a38] rounded-lg p-3 mb-4">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Current Room</p>
                    <p className="text-xl font-black text-primary">#{random}</p>
                </div>
                <button
                    onClick={joinNewRoom}
                    className="w-full py-3 bg-slate-200 dark:bg-[#233648] hover:bg-slate-300 dark:hover:bg-[#2f455a] rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">shuffle</span>
                    Switch Room
                </button>
            </div>
            {/* Dummy Users List from Design */}
            <div className="flex-1 overflow-y-auto px-4">
                 <p className="text-xs font-bold text-slate-500 uppercase mb-3 mt-4">Active Users (Simulated)</p>
                 <div className="flex flex-col gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1c2a38]">
                            <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                            <div className="flex-1">
                                <p className="text-sm font-bold">Anonymous User {i}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col relative">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22]">
                <h2 className="font-bold">Room #{random}</h2>
                <button onClick={onLeave} className="text-red-500">
                    <span className="material-symbols-outlined">logout</span>
                </button>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, index) => {
                    const isSelf = msg.sender === currentsocket?.id;
                    return (
                        <div key={index} className={`flex items-end gap-3 max-w-[90%] ${isSelf ? 'ml-auto flex-row-reverse' : ''}`}>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8 shrink-0 bg-slate-300 dark:bg-slate-700"></div>
                            <div className={`flex flex-col gap-1 ${isSelf ? 'items-end' : 'items-start'}`}>
                                <div className={`flex items-center gap-2 ${isSelf ? 'flex-row-reverse' : ''}`}>
                                    <p className="text-slate-500 dark:text-[#92adc9] text-[12px] font-bold">
                                        {isSelf ? 'You' : 'Stranger'}
                                    </p>
                                    <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className={`text-sm font-normal leading-relaxed rounded-xl px-4 py-3 shadow-sm ${
                                    isSelf
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-slate-100 dark:bg-[#233648] text-slate-900 dark:text-white rounded-bl-none'
                                }`}>
                                    {renderMessageContent(msg)}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 pb-8 bg-background-light dark:bg-background-dark">
                <div className="relative flex items-center bg-white dark:bg-[#1c2a38] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden focus-within:border-primary transition-colors">
                    <button className="pl-4 pr-2 text-slate-400 dark:text-slate-500 hover:text-primary">
                        <span className="material-symbols-outlined">add_circle</span>
                    </button>
                    <input
                        className="flex-1 bg-transparent border-none py-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        placeholder={`Message Room #${random}`}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="flex items-center gap-1 pr-3">
                        <button className="p-1 text-slate-400 dark:text-slate-500 hover:text-primary">
                            <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
                        </button>
                        <button
                            onClick={handleSendMessage}
                            className="p-2 bg-primary rounded-lg text-white ml-1 hover:bg-blue-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">send</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
}
