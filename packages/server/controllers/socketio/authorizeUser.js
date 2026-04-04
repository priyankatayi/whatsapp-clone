const redisClient = require("../../redis");
const parseFriendsList = require("./parseFriendsList");

const authorizeUser = async (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    next(new Error("Not authorized"));
  } else {
    socket.user = { ...socket.request.session.user };
    socket.join(socket.user.userid);
    //making the unique userid globally available
    //whenever the user logins we are setting the status to true
    await redisClient.hSet(`userid:${socket.user.username}`, {
      userid: socket.user.userid,
      connected: "true",
    });

    const friendsList = await redisClient.lRange(
      `friends:${socket.user.username}`,
      0,
      -1,
    );
    //get all the friends and let them know the user is disconnected

    const friendRooms = await parseFriendsList(friendsList).then((friends) =>
      friends.map((friend) => friend.userid),
    );

    if (friendRooms.length > 0) {
      socket.to(friendRooms).emit("connected", "true", socket.user.username);
      socket.emit("friendsList", await parseFriendsList(friendsList));
    }

    const messages = await redisClient.lRange(
      `messages:${socket.user.userid}`,
      0,
      -1,
    );
    if (messages && messages.length > 0) {
      const messageQuery = messages.map((msg) => {
        const parsedMessages = msg.split(".");
        return {
          to: parsedMessages[0],
          content: parsedMessages[2],
          from: parsedMessages[1],
        };
      });
      socket.emit("messages", messageQuery);
    }
    next();
  }
};

module.exports = authorizeUser;
