const express = require("express");
const chats = require("./data/data");
const connecttoDb = require("./config/db");
const dotenv = require("dotenv");
const colors = require("colors");
const path = require("path");

dotenv.config();
connecttoDb();
const server = express();

server.use(express.json());
server.use("/api/user", require("./routes/user"));
server.use("/api/chat", require("./routes/chat"));
server.use("/api/message", require("./routes/message"));

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  server.use(express.static(path.join(__dirname1, "/frontend/build")));
  server.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  server.get("/", (req, res) => {
    res.send("Api is Running Successfully");
  });
}

const Port = process.env.PORT || 8000;

const app = server.listen(
  8000,
  console.log(`Server started on port ${Port}.`.cyan.bgBlack)
);

const io = require("socket.io")(app, {
  pingTimeout: 60000,
  cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined ");
    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
