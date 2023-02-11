const ProductManager = require("./ProductManager.js");
const path = require("path");
const express = require("express");



const app = express(express.urlencoded({extended:true}));
const PORT = 8080;
const archivo_productos = path.join(__dirname,"productos.json");

const product_manager = new ProductManager(archivo_productos);


app.get("/products", async (request,response)=>{
    
    try {
        let limit = Number(request.query.limit);//?limit=4
        let productos_list = await product_manager.getProducts();

        if(!limit || isNaN(limit) || limit>productos_list.length){
            return response.json({productos_list});
        }

        let limit_products = productos_list.slice(0, limit);
        return response.json({limit_products});
        
    } catch (error) {
        return response.json({error});
    }    
});


app.get("/products/:product_id", async (request,response)=>{
    try {
        let product_id = Number(request.params.product_id);

        if(isNaN(product_id)){
            return response.send({error:"Ingrese un ID valido"});
        }

        product = await product_manager.getProductById(product_id);
        return response.json({product});
        
    } catch (error) {
        return response.json({error});
    }    
})



app.listen(PORT,()=>{
    console.log(`API running on port ${PORT}`);
})


