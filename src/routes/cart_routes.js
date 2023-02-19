const path = require("path");
const CartManager = require("../CartManager.js");
const Router = require("express");

const archivo_productos = path.join(__dirname,"../carts.json");
const cart_manager = new CartManager(archivo_productos);

const router = Router();

//  api/carts/    (GET)
router.get("/", async (request,response)=>{
    
    try {        
        let carts_list = await cart_manager.getCarts();

        return response.json({carts_list});
        
    } catch (error) {
        return response.status(400).json({error});
    }    
});

//  api/carts/[cart_id]   (GET)
router.get("/:cart_id", async (request,response)=>{
    try {
        let cart_id = Number(request.params.cart_id);

        if(isNaN(cart_id)){
            return response.status(400).json({error:"Ingrese un ID valido"});
        }

        result = await cart_manager.getCartById(cart_id);

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
        
        result = await cart_manager.addCart(products);

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
        let cart_id = Number(request.params.cart_id);
        let product_id = Number(request.params.product_id);

        if(isNaN(product_id) || isNaN(cart_id)){
            return response.status(400).json({error:"Ingrese un ID valido"});
        }

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