const socket = io("");
socket.on("server msg", (data) => {
  console.log(data);
});
const string = " test";
socket.emit("message", string);
