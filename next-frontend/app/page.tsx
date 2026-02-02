'use client';

import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useStore } from '@/store/useStore';
import { generateRandomNumber } from '@/utils/generateRandomNumber';
import Welcome from '@/components/Welcome';
import Chat from '@/components/Chat';

export default function Home() {
  const { setCurrentSocket, setRandom } = useStore();
  const socketRef = useRef<any>(null);
  const [isChatting, setIsChatting] = useState(false);

  useEffect(() => {
    // Initialize socket
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const path = process.env.NEXT_PUBLIC_SOCKET_PATH || '/sockets';

    console.log(`Connecting to ${url}${path}`);

    socketRef.current = io(url, {
      path: path,
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    setCurrentSocket(socketRef.current);

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('connect_error', (err: any) => {
      console.error('Connection error:', err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [setCurrentSocket]);

  const joinClick = () => {
    if (socketRef.current) {
        if (!socketRef.current.connected) {
            socketRef.current.connect();
        }
    }
    setRandom(generateRandomNumber());
    setIsChatting(true);
  };

  const leaveClick = () => {
    setIsChatting(false);
  };

  if (isChatting) {
    return <Chat onLeave={leaveClick} />;
  }

  return <Welcome onJoin={joinClick} />;
}
