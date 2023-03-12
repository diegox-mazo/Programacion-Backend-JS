const socket = io();
socket.emit("message", "Hola, me estoy comunicando desde un websocket");

let user;
const chatbox = document.getElementById("chatbox");

Swal.fire({
    title: 'Bienvenido, por favor identificate',
    input: 'text',
    allowOutsideClick: false,
}).then((result)=>{
    user = result.value;
    console.log(result);

    socket.emit("authenticated", user);
});


chatbox.addEventListener("keyup",(event)=>{
    if(event.key === "Enter"){
        
        if(chatbox.value.trim().length > 0){
            socket.emit('message', { user: user, message: chatbox.value });
            console.log("PRESSING ENTER", chatbox.value);

            chatbox.value = ""
        }
    }
});

socket.on("messageLogs", (data)=>{
    if(!user)return;
    let logs = document.getElementById("messageLogs");
    let messages = "";
    data.foreach((element) => {
        messages += `${element.user} dice: ${element.message}`
    });
    logs.innerHTML = messages;
})

socket.on("newUserConnected", (data)=>{
    if (!user) return;

    Swal.fire({
        title: `${data} se ha conectado`,
        toast: true,
        position : "top-end",
        showConfirmButton: false,
        timer: 3000,
        icon: "success",
    });
});