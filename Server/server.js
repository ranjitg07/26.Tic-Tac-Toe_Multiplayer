const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: "http://localhost:5173/",
});

const allUsers = [];

io.on("connection", (socket) => {
  allUsers.push({
    socket: socket,
    online: true,
  });

  socket.on("request_to_play", (data) => {
    console.log(data);
  })

  socket.on("disconnect", function () {
    for (let index = 0; index < allUsers.length; index++) {
      const user = allUsers[index];
      if (user.id === socket.id) {
        user.online = false;
      }
    }
  });
});

httpServer.listen(3000);
