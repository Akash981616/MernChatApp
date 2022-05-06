const express = require("express");
const { chats } = require("../backend/data/data.js");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.get("/", (req, res) => {
  res.send("GET request to the homepage");
});
app.get("/api/chat", (req, res) => {
  res.send(chats);
});
app.get("/api/chat/:id", (req, res) => {
  const singelChat = chats.find((e) => e._id === req.params.id);
  res.send(singelChat);
  console.log("working");
  console.log(singelChat);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server is running on port 3000");
});
