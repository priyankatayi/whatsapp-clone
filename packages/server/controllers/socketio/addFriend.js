const redisClient = require("../../redis");
const parseFriendsList = require("./parseFriendsList");

const addFriend = async (socket, friendName, cb) => {
  if (friendName === socket.user.username.toLowerCase()) {
    cb({ done: false, errorMsg: "You cannot add yourself" });
    return;
  }
  const friend = await redisClient.hGetAll(`userid:${friendName}`);
  if (Object.keys(friend).length === 0) {
    cb({ done: false, errorMsg: "User doesnt exist!" });
    return;
  }
  let friendsList = await redisClient.lRange(
    `friends:${socket.user.username}`,
    0,
    -1,
  );
  friendsList = await parseFriendsList(friendsList).then((friends) =>
    friends.map((friend) => friend.username.toLowerCase()),
  );
  if (friendsList.length > 0 && friendsList.includes(friendName)) {
    cb({ done: false, errorMsg: "Friend already exists!" });
    return;
  }
  redisClient.lPush(
    `friends:${socket.user.username}`,
    `${friendName}.${friend.userid}`,
  );
  cb({
    done: true,
    newFriend: {
      username: friendName,
      userid: friend.userid,
      connected: friend.connected,
    },
  });
};

module.exports = addFriend;
