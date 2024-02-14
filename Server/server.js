const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: "http://localhost:5173/",
});

// Define variables to store users and rooms
const allUsers = {};
const allRooms = [];

// Event listener for incoming socket connections
io.on("connection", (socket) => {
  allUsers[socket.id] = {
    socket: socket,
    online: true,
  };

  // Event listener for the "request_to_play" event
  socket.on("request_to_play", (data) => {
    const currentUser = allUsers[socket.id];
    currentUser.playerName = data.playerName;

    let opponentPlayer;

    // Find an opponent player to start the game
    for (const key in allUsers) {
      const user = allUsers[key];
      if (user.online && !user.playing && socket.id !== key) {
        opponentPlayer = user;
        break;
      }
    }

    // Create a new room and add players to it
    if (opponentPlayer) {
      allRooms.push({
        player1: opponentPlayer,
        player2: currentUser,
      });

       // Notify players that an opponent is found and assign roles
      currentUser.socket.emit("OpponentFound", {
        opponentName: opponentPlayer.playerName,
        playingAs: "circle",
      });

      opponentPlayer.socket.emit("OpponentFound", {
        opponentName: currentUser.playerName,
        playingAs: "cross",
      });

      // Event listeners for handling player moves
      currentUser.socket.on("playerMoveFromClient", (data) => {
        opponentPlayer.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });

      opponentPlayer.socket.on("playerMoveFromClient", (data) => {
        currentUser.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });
    } else {
      currentUser.socket.emit("OpponentNotFound");
    }
  });

  // Event listener for handling disconnections
  socket.on("disconnect", function () {
    const currentUser = allUsers[socket.id];
    currentUser.online = false;
    currentUser.playing = false;

    // Notify the opponent if a player disconnects
    for (let index = 0; index < allRooms.length; index++) {
      const { player1, player2 } = allRooms[index];

      if (player1.socket.id === socket.id) {
        player2.socket.emit("opponentLeftMatch");
        break;
      }

      if (player2.socket.id === socket.id) {
        player1.socket.emit("opponentLeftMatch");
        break;
      }
    }
  });
});

httpServer.listen(3000);
