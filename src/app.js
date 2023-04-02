const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const handlebars = require("express-handlebars");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const passport = require('passport');
const initializePassport = require("./config/passport.config");

const sessionRoutes = require("./routes/session.routes");
const productRoutes = require("./routes/product_routes");
const cartRoutes = require("./routes/cart_routes");
const viewRoutes = require("./routes/views.router");
const path = require("path");
const {Server} = require("socket.io");

const {DB_PASSWORD} = require("./config/config.js")// variable de entorno

const PORT = 8080;
const BASE_URL = "api";

//CONFIGURAR SERVIDOR
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(
    session({
    store: mongoStore.create({
    mongoUrl: `mongodb+srv://CoderUser:${DB_PASSWORD}@codercluster.fu6rpdy.mongodb.net/?retryWrites=true&w=majority`, //TODO convertir a variable de entorno
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 60 * 3600,
    }),
    secret: "secretSession", //TODO variable entorno
    resave: false,
    saveUninitialized: false,
    })
);

//  PASSPORT
initializePassport();
app.use(passport.initialize())

//CONFIGURAR RECURSOS STATIC
app.use('/static', express.static(`${__dirname}/public`));

//CONFIGURAR HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(`${__dirname}/views`));
app.set("view engine", "handlebars");

// CONFIGURAR MONGOOSE DB
mongoose.connect(`mongodb+srv://CoderUser:${DB_PASSWORD}@codercluster.fu6rpdy.mongodb.net/?retryWrites=true&w=majority`);


//------------------API PRODUCTS ROUTES-------------------------
//  /api/products/
app.use(`/${BASE_URL}/products`, productRoutes);

//  /api/carts/
app.use(`/${BASE_URL}/carts`, cartRoutes);

//-------------------VIEWS ROUTES------------------------------
// /  (index)
app.use(`/views`, viewRoutes);

// /realtimeproducts
app.use(`/views`, viewRoutes);

// /api/session/
app.use("/api/session/", sessionRoutes);


//------------------SERVER  with WEB-SOCKETS------------------------------
//  server live
const server = app.listen(PORT,()=>{
    console.log(`API running on port ${PORT}`);
});
const io = new Server(server); //Server sockets.io

const logs = [];
io.on("connection", (socket)=>{
    console.log("A new socket is Connected");

    //Message se utiliza para la parte de almacenar y devolver los logs
    socket.on("message", (data)=>{
        console.log("socket.on", data);
        logs.push({socketid: socket.id, message: data});
        io.emit("messageLogs", {logs});
        // TODO logs BD
    });

    // authenticated channel
    socket.on("authenticated", (data) => {
        socket.broadcast.emit("newUserConnected", data);
    });

})