const express = require("express");
const handlebars = require("express-handlebars");
const productRoutes = require("./src/routes/product_routes");
const cartRoutes = require("./src/routes/cart_routes");
const viewRoutes = require("./src/routes/views.router");
const path = require("path");
const {Server} = require("socket.io");

const PORT = 8080;
const BASE_URL = "api";

//CONFIGURAR SERVIDOR
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//CONFIGURAR RECURSOS STATIC
app.use(express.static(`${__dirname}/src/public`))

//CONFIGURAR HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(`${__dirname}/src/views`));
app.set("view engine", "handlebars");

//------------------API PRODUCTS-------------------------
//  /api/products/
app.use(`/${BASE_URL}/products`, productRoutes);

//  /api/carts/
app.use(`/${BASE_URL}/carts`, cartRoutes);

//-------------------VIEWS------------------------------
// /  (index)
app.use(`/`, viewRoutes);

// /realtimeproducts
app.use(`/`, viewRoutes);


//------------------SERVER  with WEB-SOCKETS------------------------------
//  server live
const server = app.listen(PORT,()=>{
    console.log(`API running on port ${PORT}`);
})

const io = new Server(server); //Server sockets.io

//const logs = [];

io.on("connection", (socket)=>{
    console.log("A new client is Connected");
    //console.log(socket);

    socket.on("message", (data)=>{
        console.log("socket.on", data);
        io.emit("log", data);
    })

    // //Message2 se utiliza para la parte de almacenar y devolver los logs
    // socket.on("messageBySocket", (data)=>{
    //     console.log("socket.on ~ data", data);
    //     logs.push({socketid: socket.id, message: data});
    //     io.emit("log", {logs});
    // })

    // socket.broadcast.emit(
    //     "messageForEveryOne"
    // )
})

