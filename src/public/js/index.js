const socket = io();
socket.emit("message", "Hola, me estoy comunicando desde un websocket");

socket.on("message", (data)=>{
    console.log(data);
})