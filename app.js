const express = require("express");
const productRoutes = require("./src/routes/product_routes");
const cartRoutes = require("./src/routes/cart_routes");

const PORT = 8080;
const BASE_URL = "api";


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//  /api/products/
app.use(`/${BASE_URL}/products`, productRoutes);

//  /api/carts/
app.use(`/${BASE_URL}/carts`, cartRoutes);

//  server live
app.listen(PORT,()=>{
    console.log(`API running on port ${PORT}`);
})