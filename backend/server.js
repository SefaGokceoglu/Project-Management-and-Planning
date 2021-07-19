const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8081"],

    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

// Run Server
const server = app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", ({ User, ChatRoom }, callback) => {
    socket.join(ChatRoom);
  });
  socket.on("SendMessage", (data) => {
    socket.broadcast.to(data.chat).emit("NewMessage", data);
  });

  socket.on("SendGroupMessage", (data) => {
    socket.broadcast.to(data.group).emit("NewMessage", data);
  });

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

/*app.use((request, response, next) => {
  request.io = io;
  next();
});*/

mongoose.connect(
  process.env.MONGO_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB connected");
  }
);

//Middleware User
const UsersRoute = require("./routes/user.router");
app.use("/users", UsersRoute);

// Middleware Group
const GroupRoute = require("./routes/group.router");
app.use("/groups", GroupRoute);

// Middleware Message
const MessageRoute = require("./routes/message.router");
app.use("/message", MessageRoute);

//Middleware GroupMessage
const GroupMessageRoute = require("./routes/group.message.router");
app.use("/groupmessage", GroupMessageRoute);

//Middleware Project
const ProjectRoute = require("./routes/project.router");
app.use("/project", ProjectRoute);
