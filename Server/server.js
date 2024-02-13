const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: "http://localhost:5173/",
});

const allUsers = [];

io.on("connection", (socket) => {
  allUsers[socket.id] = {
    socket: socket,
    online: true,
  };

  socket.on("request_to_play", (data) => {
    const currentUser = allUsers[socket.id]
    currentUser.playerName = data.playerName;
    
  });

  socket.on("disconnect", function () {
    allUsers[socket.id] = {
      socket: { ...socket, online: false },
      online: true,
    };
  });
});

httpServer.listen(3000);
