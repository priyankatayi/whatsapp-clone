require("dotenv").config();

const express = require("express");
const { Server } = require("socket.io");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const server = require("http").createServer(app);
const authRouter = require("./routers/authRouter");
const {
  sessionMidleware,
  wrap,
  corsConfig,
} = require("./controllers/serviceController");
const {
  authorizeUser,
  addFriend,
  onDisconnect,
  addMessage,
} = require("./controllers/socketController");
const io = new Server(server, {
  cors: corsConfig,
});

app.use(helmet());

app.use(cors(corsConfig));

app.use(express.json());
// server receives any http request that comes in, it is handled by our express server.
// Every req is going through express session middleware which I set it up and this middleware is parsing any cookies user might have sent
//  and is using the cookie to retrieve user session  information and attaches it to the req object under req.session

app.use(sessionMidleware);

app.use("/auth", authRouter);

//socket io requests will not go through expression session middlware,
// so you will not have access to session cookies
//so we have create a common session for both express and socket io to use.

io.use(wrap(sessionMidleware));
// only if the user is loggeds in, we are making socket io connection
io.use(authorizeUser);
//socket io now has access to session
io.on("connect", (socket) => {
  console.log(socket.user.userid);
  console.log(socket.user.username);

  socket.on("add friend", (friendName, cb) =>
    addFriend(socket, friendName, cb),
  );

  socket.on("message", (message) => addMessage(socket, message));

  socket.on("disconnecting", () => onDisconnect(socket));
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});
