import { useState } from "react";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSocketContext } from "./context/SocketContext";
import { Game, Home } from "./pages";
import Room from "./pages/Room";
import MainLayout from "./shared/MainLayout";

function App() {
  const location = useLocation();
  const [path, setPath] = useState("");
  const { socket } = useSocketContext();

  useEffect(() => {
    path === `/game/${socket?.id}` && socket?.emit("delete-room");
    if (!location.pathname.includes("/game/")) {
      socket?.disconnect();
      socket?.connect(import.meta.env.VITE_SOCKET_END_POINT);
      console.log("socket.id", socket?.id);
    }
    setPath(location.pathname);
  }, [location, socket]);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index={true} element={<Home />} />
        <Route path="game" element={<Game />} />
        <Route path="game/:room" element={<Room />} />
      </Route>
    </Routes>
  );
}

export default App;
