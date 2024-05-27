// socket.js
import React from "react";
import { io } from "socket.io-client";

const URL = "http://localhost:8080"; // Replace with your server URL
export const socket = io(URL, {
  query: {
    token: localStorage.getItem("token"),
  },
});
export const SocketContext = React.createContext();
