const express = require("express");
const { chats } = require("../backend/data/data.js");
const dotenv = require("dotenv");
const connectDB=require("./config/db");
const colors=require("colors");
const {notFound,errorHandler}=require("./middleware/errorMiddleware")
const userRoutes=require("./routes/userRoutes");
const chatRoutes=require('./routes/chatRoutes')
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

app.use("/api/chat",chatRoutes);

app.use("/api/user",userRoutes)

app.get("/api/chat/:id", (req, res) => {
  const singelChat = chats.find((e) => e._id === req.params.id);
  res.send(singelChat);
  console.log(singelChat,"working".bgMagenta);
  console.log();
});

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`.yellow.bold);
  
});
