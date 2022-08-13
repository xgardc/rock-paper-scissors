const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);

const listener = server.listen(3001, () => {
  console.log(`Server is listening on port: ${listener.address().port}`);
});

const io = new Server(server, { cors: "*" });

io.on("connection", function (socket) {
  console.log("User connected: ", socket.id);

  socket.on("request-room-list", () => socket.emit("send-room-list", rooms));

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    Object.entries(rooms).forEach(([key, players]) => {
      if (key === socket.id) return delete rooms[socket.id];
      if (players.find((player) => player.id === socket.id))
        return rooms[key].pop();

      if (
        key === socket.id ||
        players.find((player) => player.id === socket.id)
      ) {
        socket.broadcast.emit("user-disconnect", key, socket.id);
      }
    });
  });

  socket.on("create-room", (secret) => {
    rooms[socket.id] = [{ id: socket.id, secret }];
    console.log(`Room created: ${socket.id}`);
  });

  socket.on("delete-room", () => {
    delete rooms[socket.id];
    console.log(`Room deleted: ${socket.id}`);
  });

  socket.on("join-room", (roomId) => {
    console.log(`${socket.id} trying to connect ${roomId}`);

    if (!rooms[roomId]) return socket.emit("join-room-error", "404");
    if (roomId === socket.id) return;
    if (rooms[roomId].length !== 1 && rooms[roomId][1].id !== socket.id)
      return socket.emit("join-room-error", "full");
    console.log(`${socket.id} joined to ${roomId}`);
    rooms[roomId][1]?.id !== socket.id && rooms[roomId].push({ id: socket.id });
    socket.emit("join-success");
    socket.broadcast.emit("user-join", roomId, socket.id);
  });

  socket.on("action", (roomId, selection) => {
    if (!rooms[roomId]) return;
    const player = rooms[roomId].find((player) => player.id === socket.id);
    player.ready = true;
    player.selection = selection;
    console.log(player.id, selection);
    const notReady = rooms[roomId].filter((player) => !player.ready);
    if (!notReady.length) {
      io.emit("game-finish", roomId, rooms[roomId]);
      rooms[roomId].forEach((player) => {
        delete player.ready;
        delete player.selection;
        return player;
      });
    }
  });
});

const rooms = {};
