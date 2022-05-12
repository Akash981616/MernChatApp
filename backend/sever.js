const express = require("express");
const { chats } = require("../backend/data/data.js");
const dotenv = require("dotenv");
const connectDB=require("./config/db");
const colors=require("colors");
const {notFound,errorHandler}=require("./middleware/errorMiddleware")
const userRoutes=require("./routes/userRoutes");
const chatRoutes=require('./routes/chatRoutes')
const messageRoutes = require("./routes/messageRoutes");
const app = express()


dotenv.config();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send(" homepage");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.get("/api/chat/:id", (req, res) => {
  const singelChat = chats.find((e) => e._id === req.params.id);
  res.send(singelChat);
  console.log(singelChat,"working".bgMagenta);
  console.log();
});


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server=app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`.yellow.bold);
  
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});