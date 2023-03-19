const path = require("path");
const ProductManager = require("../ProductManager.js");
const Router = require("express");
const productModel = require('../models/product.model');

const productsData= require("../data/products.json");


const archivo_productos = path.join(__dirname,"../data/products.json");
const product_manager = new ProductManager(archivo_productos);
const router = Router();


//  /api/products/insertion   --> inicializar la coleccion de BD
router.get("/insertion", async (request,response)=>{
    try {
        const products = await productModel.insertMany(productsData);
        return response.json({
            message: 'Insercion productos en BD',
            products: products
        }); 

    } catch (error) {
        return response.status(400).json({error});
    }    
});

//  (Obtener ListdoProductos)
//  /api/products/ ?limit=4 & ?page=1 & category= & status=  $ sort=asc/desc     
router.get("/", async (request,response)=>{
    
    try {
        const {limit = 10} = request.query;

        const {page=1} = request.query;

        const{category=null} = request.query;

        const{status=null} = request.query;

        const{sort=null} = request.query;


        // let productos_list = await product_manager.getProducts();  --> File
        //let productos_list = await productModel.find().limit(limit)// MongoDB
        let productos_list = await productModel.paginate({$or:[{category:`${category}`},{status:`${status}`}]}, {limit:limit, page:page, sort:{price:sort}});

        /* if(!limit || isNaN(limit) || limit>productos_list.length){
            return response.json({productos_list});
        }

        let limit_products = productos_list.slice(0, limit); */

        return response.json({productos_list});
        
    } catch (error) {
        return response.status(400).json({error});
    }    
});

//  api/products/[product_id]
router.get("/:product_id", async (request,response)=>{
    try {
        
        /* let product_id = Number(request.params.product_id);        

        if(isNaN(product_id)){
            return response.status(400).json({error:"Ingrese un ID valido"});
        } */

        let product_id = request.params.product_id;

        //result = await product_manager.getProductById(product_id); --> File
        result = await productModel.findById(product_id) // MongoDB

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
        //result = await product_manager.addProduct(newProduct);
        result = await productModel.create(newProduct);

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
        /* let product_id = Number(request.params.product_id);
        if(isNaN(product_id)){
            return response.status(400).json({error:"Ingrese un ID valido"});
        } */

        let product_id = request.params.product_id;
        let newProduct = request.body;
        //result = await product_manager.updateProduct(product_id, newProduct);
        result = await productModel.updateOne({_id: product_id}, {$set: newProduct});

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
        /* let product_id = Number(request.params.product_id);
        if(isNaN(product_id)){
            return response.status(400).json({error:"Ingrese un ID valido"});
        } */

        let product_id = request.params.product_id;
        //result = await product_manager.deleteProduct(product_id);
        result = await productModel.deleteOne({_id: product_id});

        if(result.error){
            return response.status(400).json({result});
        }

        return response.json({result});
        
    } catch (error) {
        return response.status(400).json({error});
    }
});

module.exports = router;