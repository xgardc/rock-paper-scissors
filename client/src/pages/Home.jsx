import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSocketContext } from "../context/SocketContext";

function Home() {
  const { socket } = useSocketContext();
  const [rooms, setRooms] = useState(false);

  useEffect(() => {
    function sendRequest() {
      socket?.emit("request-room-list");
    }
    sendRequest();
    const interval = setInterval(sendRequest, 100);
    socket?.on("send-room-list", (roomList) => {
      const formattedRooms = Object.entries(roomList)
        .map(([key, value]) => {
          const room = value[0];
          if (!room.secret) return room.id;
        })
        .filter((room) => room);
      setRooms(formattedRooms);
    });
  }, [socket]);
  return (
    <>
      <section className="px-4 flex flex-row gap-3 w-screen flex-wrap items-center justify-between gap-y-5">
        {rooms !== false ? (
          <>
            {rooms.length ? (
              <>
                {rooms.map((room, index) => (
                  <Link
                    key={index}
                    to={`/game/${room}`}
                    className="h-12 bg-white flex items-center justify-between px-4 rounded-md w-full md:w-[calc(50%-10px)] lg:w-[calc(33%-10px)] shadow-inner shadow-neutral-400"
                  >
                    {room}
                    <span className="text-xs opacity-70 transition-opacity hover:opacity-100 hover:underline">
                      Odaya gir +
                    </span>
                  </Link>
                ))}
              </>
            ) : (
              <div className="text-orange-700 bg-orange-200 h-10 grid place-items-center px-3 rounded-lg">
                Şu anda hiçbir herkese açık oda yok.
              </div>
            )}
          </>
        ) : (
          <div>Yükleniyor...</div>
        )}
      </section>
    </>
  );
}

export default Home;
