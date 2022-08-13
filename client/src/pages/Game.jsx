import { useState } from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../context/SocketContext";

function Game() {
  const { socket } = useSocketContext();
  const navigate = useNavigate();
  const [secret, setSecret] = useState(false);

  const handleClick = useCallback(
    function () {
      console.log(secret);
      socket?.emit("create-room", secret);
      navigate(`/game/${socket.id}`);
    },
    [socket, secret]
  );

  return (
    <div className="px-10 flex flex-col gap-4 items-center">
      <label className="flex items-center relative w-32">
        <input
          type="checkbox"
          className="hidden"
          onChange={(e) => setSecret(e.target.checked)}
        />
        <div
          className={`w-5 h-5 border grid place-items-center rounded-full ${
            secret ? "border-indigo-600" : "border-neutral-500"
          }`}
        >
          <div
            className={`bg-indigo-600 rounded-full transition-all ${
              secret ? "opacity-100 w-3 h-3" : "opacity-0 w-0 h-0"
            }`}
          />
        </div>
        <div className="px-2">Gizli oda</div>
        <span className="peer flex items-center justify-center text-sm h-5 w-5 text-white rounded-full bg-neutral-800 z-30">
          ?
        </span>
        <span className="absolute left-32 bg-neutral-900 text-white h-7 w-56 rounded-md text-xs opacity-0 transition-opacity duration-200 peer-hover:opacity-80 peer-hover:duration-700 flex items-center justify-center gap-1.5">
          Odanız herkese açık listede görünmez.
        </span>
      </label>
      <button
        onClick={handleClick}
        className="w-40 h-14 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white rounded-lg font-semibold tracking-wider"
      >
        Oda Oluştur
      </button>
    </div>
  );
}

export default Game;
