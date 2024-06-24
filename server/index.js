const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("Socket.IO server is running");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined room: ${conversationId}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("deleteMessage", (message) => {
    const { messageId, conversationId } =
      JSON.parse(message);

    if (conversationId) {
      socket
        .to(conversationId)
        .emit("deleteMessage", messageId);
    } else {
      console.error("User is not in a room");
    }
  });
  socket.on("updateMessage", (message) => {
    const { messageId, content, conversationId } =
      JSON.parse(message);

    if (conversationId) {
      socket
        .to(conversationId)
        .emit("updateMessage", message);
    } else {
      console.error("User is not in a room");
    }
  });

  socket.on("createMessage", (msg) => {
    const { message, conversationId } = JSON.parse(msg);

    if (conversationId) {
      socket
        .to(conversationId)
        .emit("createMessage", message);
    } else {
      console.error("User is not in a room");
    }
  });

  socket.on("focusInput", (message) => {
    const { conversationId } = JSON.parse(message);
    console.log("focusInput", conversationId);

    if (conversationId) {
      socket
        .to(conversationId)
        .emit("focusInput", conversationId);
    } else {
      console.error("User is not in a room");
    }
  });

  socket.on("blurInput", (message) => {
    const { conversationId } = JSON.parse(message);

    if (conversationId) {
      socket
        .to(conversationId)
        .emit("blurInput", conversationId);
    } else {
      console.error("User is not in a room");
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
