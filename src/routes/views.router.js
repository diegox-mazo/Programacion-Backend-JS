const {Router}= require("express");
const ProductManager = require("../ProductManager.js");
const path = require("path");
//import {messageModel} from '../models/message.model';
const messageModel = require('../models/message.model');

const router = Router();
const archivo_productos = path.join(__dirname,"../data/products.json");
const product_manager = new ProductManager(archivo_productos);

router.get("/", async (request, response)=>{

    let productos_list = await product_manager.getProducts();

    response.render("home",{
        products: productos_list,
    });
});

router.get("/realtimeproducts", async (request, response)=>{

    let productos_list = await product_manager.getProducts();

    response.render("realTimeProducts",{
        products: productos_list,
    });
});

router.get("/chat", async (request, response) => {
    response.render("chat");
});



module.exports = router;