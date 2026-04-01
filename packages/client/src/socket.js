import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
