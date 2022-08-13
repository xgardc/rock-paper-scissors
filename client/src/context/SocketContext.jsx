import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();
export const useSocketContext = () => useContext(SocketContext);

export const Provider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io(import.meta.env.VITE_SOCKET_END_POINT));
  }, []);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
