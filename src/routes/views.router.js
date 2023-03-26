const { Router } = require("express");
const ProductManager = require("../ProductManager.js");
const path = require("path");
//import {messageModel} from '../models/message.model';
const messageModel = require('../models/message.model');
const authMdw = require("../middleware/auth.middleware");

const router = Router();
const archivo_productos = path.join(__dirname, "../data/products.json");
const product_manager = new ProductManager(archivo_productos);

router.get("/", async (request, response) => {

    let productos_list = await product_manager.getProducts();

    response.render("home", {
        products: productos_list,
    });
});

router.get("/realtimeproducts", async (request, response) => {

    let productos_list = await product_manager.getProducts();

    response.render("realTimeProducts", {
        products: productos_list,
    });
});

router.get("/chat", async (request, response) => {
    response.render("chat");
});

router.get("/products", async (request, response) => {

    try {
        const { limit = 10 } = request.query;

        const { page = 1 } = request.query;

        const { category = null } = request.query;

        const { status = null } = request.query;

        const { sort = null } = request.query;


        // let productos_list = await product_manager.getProducts();  --> File
        //let productos_list = await productModel.find().limit(limit)// MongoDB
        let productos_list = await productModel.paginate({ $or: [{ category: `${category}` }, { status: `${status}` }] }, { limit: limit, page: page, sort: { price: sort } });

        /* if(!limit || isNaN(limit) || limit>productos_list.length){
            return response.json({productos_list});
        }

        let limit_products = productos_list.slice(0, limit); */

        const usuario = req.session?.user;

        response.render("products", {
            status: "success",
            products: productos_list.docs,
            totalPages: productos_list.totalDocs,
            prevPage: productos_list.prevPage,
            nextPage: productos_list.nextPage,
            page: productos_list.page,
            hasPrevPage: productos_list.hasPrevPage,
            hasNextPage: productos_list.hasNextPage,

            user: usuario,

        });

    } catch (error) {
        return response.status(400).json({ error });
    }

});

router.get("/carts/:cart_id", async (request, response) => {

    try {

        let cart_id = request.params.cart_id;

        result = await cartModel.findById(cart_id);

        if (result.error) {
            return response.status(400).json({ result });
        }

        response.render("carts", {
            products: result.products,
        });

    } catch (error) {
        return response.status(400).json({ error });
    }
});


// SESSION

router.get("/login", async (req, res) => {
    res.render("login");
});

router.get("/register", async (req, res) => {
    res.render("register");
});

router.get("/profile", authMdw, async (req, res) => {
    const user = req.session.user;

    res.render("profile", {user});
});





module.exports = router;