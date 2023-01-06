import io from "socket.io-client";

let socket = undefined;
const localIP = "localhost";
const networkIP = "172.26.26.130";
const port = 7777;
const networkConnection = false;

function initializeSocket() {
  const url = networkConnection
    ? `http://${networkIP}:${port}`
    : `http://${localIP}:${port}/pty`;

  socket = io(url);
  // client-side
  // socket.on("connect", () => {
  //     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  //   });
}

export function addEventListener(event) {
  if (!socket) {
    initializeSocket();
  }
  socket.on(event.type, event.callback);
}
export function removeEventListener(event) {
  console.log("remove event")
  console.log(event.listener)
  //To unsubscribe all listeners of an event
  // socket.off('event-name');

  //to unsubscribe a certain listener
  socket.off(event.type, event.listener);
}

export function sendEvent(event) {
  socket.emit(event.type, event.data);
}
