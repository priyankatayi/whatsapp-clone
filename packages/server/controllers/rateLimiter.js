const redisClient = require("../redis");

module.exports.rateLimiter =
  (secondsLimit, limitTries) => async (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    //add a key ip and increment it everytime by 1 and reset in 60 secs
    //exec executes multiple queries
    const [response] = await redisClient.multi().incr(ip).expire(ip, 60).exec();
    if (response > limitTries) {
      res.json({ loggedIn: false, status: "Slow Down, try again!!" });
    } else {
      next();
    }
  };
