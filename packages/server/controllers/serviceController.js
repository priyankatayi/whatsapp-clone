require("dotenv").config();
const RedisStore = require("connect-redis").default;
const session = require("express-session");
const redisClient = require("../redis");

const sessionMidleware = session({
  secret: process.env.COOKIE_SECRET,
  name: "sid",
  store: new RedisStore({ client: redisClient }), //store where to save the sessions
  resave: false,
  saveUninitialized: false,

  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
});

const corsConfig = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST"],
  credentials: true,
};
const wrap = (expressMiddleware) => (socket, next) =>
  expressMiddleware(socket.request, {}, next);

module.exports = { sessionMidleware, corsConfig, wrap };
