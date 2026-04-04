import { useEffect } from "react";
import socket from "../socket";
import { useAccountContext } from "../AccountContextProvider";

const useSocket = (setFriendsList, setMessages) => {
  const { setIsLoggedIn } = useAccountContext();
  useEffect(() => {
    socket.connect();
    socket.on("connect_error", () => {
      setIsLoggedIn(false);
    });

    socket.on("friendsList", (friendsList) => {
      setFriendsList(friendsList);
    });

    socket.on("messages", (messages) => {
      setMessages(messages);
    });

    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("connected", (status, username) => {
      setFriendsList((prev) =>
        prev.map((friend) =>
          friend.username === username
            ? { ...friend, connected: status }
            : friend,
        ),
      );
    });

    return () => {
      socket.off("connect_error");
      socket.off("connected");
      socket.off("friendsList");
      socket.off("messages");
    };
  }, [setFriendsList, setMessages, setIsLoggedIn]);
};

export default useSocket;
