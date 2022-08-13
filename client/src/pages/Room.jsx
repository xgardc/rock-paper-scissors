import { useCallback } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocketContext } from "../context/SocketContext";

function Room() {
  const { socket } = useSocketContext();
  const { room } = useParams();
  const [error, setError] = useState();
  const [roomFullfilled, setRoomFullfilled] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [message, setMessage] = useState(
    `Başarıyla ${room} odasına giriş yaptınız.`
  );
  const [selection, setSelection] = useState("Taş");

  useEffect(() => {
    socket?.emit("join-room", room);
    socket?.on("join-success", () => setRoomFullfilled(true));
    socket?.on("join-room-error", (error) => {
      switch (error) {
        case "404":
          setError("Oda bulunamadı.");
          break;
        case "full":
          setError("Girmeye çalıştığınız oda dolu.");
          break;
      }
    });

    socket?.on("game-finish", (roomId, roomObject) => {
      if (roomId !== room) return;
      const player1 = roomObject[0];
      const player2 = roomObject[1];

      switch (player1.selection) {
        case "Taş":
          switch (player2.selection) {
            case "Makas":
              player1Won();
              break;
            case "Kağıt":
              player2Won();
              break;
            default:
              draw();
              break;
          }
          break;
        case "Kağıt":
          switch (player2.selection) {
            case "Taş":
              player1Won();
              break;
            case "Makas":
              player2Won();
              break;
            default:
              draw();
              break;
          }
          break;
        case "Makas":
          switch (player2.selection) {
            case "Kağıt":
              player1Won();
              break;
            case "Taş":
              player2Won();
              break;
            default:
              draw();
              break;
          }
          break;
      }

      function player1Won() {
        setMessage(
          `Oyunu ${player1.id === socket.id ? "kazandın" : "kaybettin."}`
        );
      }

      function player2Won() {
        setMessage(
          `Oyunu ${player2.id === socket.id ? "kazandın" : "kaybettin."}`
        );
      }

      function draw() {
        setMessage("Berabere.");
      }

      setWaiting(false);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on(
      "user-join",
      (roomId, socketId) => roomId === room && setRoomFullfilled(true)
    );
    socket?.on(
      "user-disconnect",
      (roomId) => roomId === room && setRoomFullfilled(false)
    );
  }, []);

  const selectAction = useCallback(function (selection) {
    setSelection(selection);
  });

  const handleConfirm = useCallback(
    function () {
      socket?.emit("action", room, selection);
      setWaiting(true);
      setMessage("Diğer oyundunun seçim yapması bekleniyor...");
    },
    [room, selection]
  );

  return (
    <div>
      {error ? (
        error
      ) : (
        <>
          <header className="h-14 bg-neutral-50 border-b border-neutral-300 text-neutral-600 w-screen -mt-4 px-7 flex items-center justify-center">
            {message}
          </header>
          {!waiting && (
            <section className="flex flex-col gap-5">
              <div className="flex w-full gap-5 pt-5 justify-center">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => selectAction(action)}
                    className={`${
                      action === selection
                        ? "bg-neutral-100 border-indigo-700 text-indigo-700 shadow-inner shadow-indigo-600"
                        : "bg-neutral-200 border-neutral-400 text-neutral-400 shadow-none hover:border-neutral-500 hover:text-neutral-500 hover:bg-neutral-100"
                    } border-2 rounded-full grid place-content-center w-28 h-28 text-xl font-bold transition-all`}
                  >
                    {action}
                  </button>
                ))}
              </div>
              <button
                disabled={!roomFullfilled}
                onClick={handleConfirm}
                className="h-14 w-24 bg-indigo-600 text-white rounded-full font-semibold self-center disabled:opacity-80 disabled:cursor-not-allowed"
              >
                Onayla
              </button>
              {!roomFullfilled && (
                <div className="text-yellow-700 bg-yellow-200 w-[22rem] max-w-screen grid place-items-center h-14 rounded-xl self-center">
                  2 kullanıcı girmeden oyuna başlayamazsın!
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}

const actions = ["Taş", "Kağıt", "Makas"];

export default Room;
