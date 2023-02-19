const path = require("path");
const ProductManager = require("../ProductManager.js");
const Router = require("express");

const archivo_productos = path.join(__dirname,"..","products.json");//TODO revisar ruta como devolverse??
const product_manager = new ProductManager(archivo_productos);

const router = Router();



//  api/products/   ?limit=4
router.get("/", async (request,response)=>{
    
    try {
        let limit = Number(request.query.limit);
        let productos_list = await product_manager.getProducts();

        if(!limit || isNaN(limit) || limit>productos_list.length){
            return response.json({productos_list});
        }

        let limit_products = productos_list.slice(0, limit);
        return response.json({limit_products});
        
    } catch (error) {
        return response.status(400).json({error});
    }    
});

//  api/products/[product_id]
router.get("/:product_id", async (request,response)=>{
    try {
        let product_id = Number(request.params.product_id);

        if(isNaN(product_id)){
            return response.status(400).json({error:"Ingrese un ID valido"});
        }

        result = await product_manager.getProductById(product_id);

        if(result.error){
            return response.status(400).json({result});
        }

        return response.json({result});
        
    } catch (error) {
        return response.status(400).json({error});
    }    
});

//  api/products/     (POST)
router.post("/", async (request,response)=>{
    try {
        let newProduct = request.body;
        result = await product_manager.addProduct(newProduct);

        if(result.error){
            return response.status(400).json({result});
        }

        return response.json({
            result : result,
            product : newProduct
        });
        
    } catch (error) {
        return response.status(400).json({error});
    }
});


//  api/products/[product_id]     (PUT)
router.put("/:product_id", async (request,response)=>{
    try {
        let product_id = Number(request.params.product_id);
        if(isNaN(product_id)){
            return response.status(400).json({error:"Ingrese un ID valido"});
        }

        let newProduct = request.body;
        result = await product_manager.updateProduct(product_id, newProduct);

        if(result.error){
            return response.status(400).json({result});
        }

        return response.json({
            result : result,
            product : newProduct
        });
        
    } catch (error) {
        return response.status(400).json({error});
    }
});


// api/products/[product_id]     (DELETE)
router.delete("/:product_id", async (request,response)=>{
    try {
        let product_id = Number(request.params.product_id);
        if(isNaN(product_id)){
            return response.status(400).json({error:"Ingrese un ID valido"});
        }

        result = await product_manager.deleteProduct(product_id);

        if(result.error){
            return response.status(400).json({result});
        }

        return response.json({result});
        
    } catch (error) {
        return response.status(400).json({error});
    }
});

module.exports = router;