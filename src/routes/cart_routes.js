const path = require("path");
const CartManager = require("../CartManager.js");
const Router = require("express");
//import {cartModel} from '../models/cart.model.js';
const cartModel = require('../models/cart.model');

const cartsData= require("../data/carts.json");


const archivo_productos = path.join(__dirname,"../data/carts.json");
const cart_manager = new CartManager(archivo_productos);

const router = Router();


//  /api/carts/insertion   --> inicializar la coleccion de BD
router.get("/insertion", async (request,response)=>{
    try {
        const carts = await cartModel.insertMany(cartsData);
        return response.json({
            message: 'Insercion carts en BD',
            carts: carts
        }); 

    } catch (error) {
        return response.status(400).json({error});
    }    
});


//  api/carts/    (GET)
router.get("/", async (request,response)=>{
    
    try {        
        //let carts_list = await cart_manager.getCarts();  --> file
        let carts_list = await cartModel.find(); // MongoDB

        return response.json({carts_list});
        
    } catch (error) {
        return response.status(400).json({error});
    }    
});

//  api/carts/[cart_id]   (GET)
router.get("/:cart_id", async (request,response)=>{
    try {
        /* let cart_id = Number(request.params.cart_id);
        if(isNaN(cart_id)){
            return response.status(400).json({error:"Ingrese un ID valido"});
        } */

        let cart_id = request.params.cart_id;
        //result = await cart_manager.getCartById(cart_id);
        result = await cartModel.findById(cart_id);

        if(result.error){
            return response.status(400).json({result});
        }

        return response.json({result});
        
    } catch (error) {
        return response.status(400).json({error});
    }    
});


//  api/carts/     (POST)
router.post("/", async (request,response)=>{
    try {
        let products = request.body;
        
        //result = await cart_manager.addCart(products);
        result = await cartModel.model(products);

        if(result.error){
            return response.status(400).json({result});
        }

        return response.json({result});
        
    } catch (error) {
        return response.status(400).json({error});
    }
});


//  api/carts/[cart_id]/products/[product_id]     (POST)
router.post("/:cart_id/products/:product_id", async (request,response)=>{
    try {
        /* let cart_id = Number(request.params.cart_id);
        let product_id = Number(request.params.product_id);

        if(isNaN(product_id) || isNaN(cart_id)){
            return response.status(400).json({error:"Ingrese un ID valido"});
        } */


        let cart_id = request.params.cart_id;
        let product_id = request.params.product_id;
        result = await cart_manager.updateProductInCart(cart_id, product_id);

        if(result.error){
            return response.status(400).json({result});
        }

        return response.json({result});
        
    } catch (error) {
        return response.status(400).json({error});
    } 
});



module.exports = router;