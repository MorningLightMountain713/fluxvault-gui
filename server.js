const express = require("express");
const http = require("http").Server(express);
const socketio = require("socket.io")(http, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:8080",
  },
});
const port = 3030;

socketio.on("connection", (socket) => {
  // new socket connected
  for (let i in [...Array(5).keys()]) {
      socket.emit("messageChannel", "hi there champ");

  }

  // listen for a 'message' event
  socket.on("message", (eventData) => {
    // attach the current time
    eventData.processed = Date.now();

    // send the message back to the client
    socket.emit("message", eventData);
    console.log(eventData);
  });
});

http.listen(port, () => {
  console.log("Server started on port", port);
});
