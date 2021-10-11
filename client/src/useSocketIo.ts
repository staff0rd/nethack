import { useEffect, useState } from "react";
import { io } from "socket.io-client";
export const socket = io("http://localhost:3001", {
  secure: true,
  reconnection: true,
  rejectUnauthorized: false,
  transports: ["websocket"],
});

export const useSocketIo = () => {
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    console.log("connecting to server");
    //.connect();
    socket.on("connect", function () {
      setConnected(true);
      //term.write("\r\n*** Connected to backend ***\r\n");
    });
    socket.on("connect_error", (err) => console.error("socket error", err));

    // Browser -> Backend
    // term.onKey(function (ev) {
    //   socket.emit("data", ev.key);
    // });
    // // Backend -> Browser
    // socket.on("data", function (data) {
    //   term.write(data);
    // });
    socket.on("conn", (data) => {
      console.log(data);
    });

    socket.on("disconnect", function () {
      //term.write("\r\n*** Disconnected from backend ***\r\n");
      setConnected(false);
    });

    return () => {
      socket.close();
    };
  }, []);
  return { connected, emit: (data: string) => socket.emit("data", data) };
};
