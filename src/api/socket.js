import { io } from "socket.io-client";

export const socket = io("ws://", {
  path: "/sockets",
  autoConnect: false,
});
