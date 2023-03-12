const fs = require("fs/promises");
const cartModel = require('./models/cart.model');

class CartManager{

    constructor(ruta_archivo){

        this.carts = [];
        this.path = ruta_archivo;

    }

    async addCart({ products }){

        //1. leer archivo
        this.carts = await this.getCarts();
        
        // Generar ID autoincremental
        let id = this.carts.length > 0 ? this.carts[this.carts.length-1].id + 1 : 1;
        this.carts.push({id, products});        

        //2. Guarda en archivo
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts));
            
        } catch (error) {
            console.log("ERROR: "+ error);
            return { error : error};
        }
        console.log("Carrito Creado Exitosamente");
        return { result : "Carrito Creado Exitosamente"};
    }

    async getCarts(){

        try{
            // Comprobar que existe Archivo

            //if(await this.exists(this.path)){
                let info = await fs.readFile(this.path);
                return JSON.parse(info);
            //}
            /* else{
                return this.products;
            }  */           
        }
        catch(error){
            console.log("ERROR: "+ error);
            return {error : error};
        }    
    }

    async getCartById(id){

        //1. leer archivo
        this.carts = await this.getCarts();

        const encontrado = this.carts.find(cart => cart.id === id);

        if(encontrado){
            return encontrado;
        }
        else{
            console.log("Carrito no encontrado")
            return {error:"Carrito no encontrado"};
        }
    }

    /* async updateProductInCart(cart_id, prod_id){

        try {
            //  Buscar el Cart
            const cart_encontrado = await this.getCartById(cart_id);

            if(!cart_encontrado.error){
                let cart_index = this.carts.findIndex((cart => cart.id === cart_id));

                //  Buscar el producto
                const prod_encontrado = this.carts[cart_index].products.find(prod=> prod.id === prod_id);


                // Si lo encuentra Aumentar cantidad
                if(prod_encontrado){
                    let prod_index = this.carts[cart_index].products.findIndex((prod => prod.id === prod_id));
                    let quantity = this.carts[cart_index].products[prod_index].quantity;
                    this.carts[cart_index].products[prod_index] = {id: prod_id, quantity: quantity+1}

                }// Si no agregarlo al carrito
                else{
                    this.carts[cart_index].products.push({id:prod_id, quantity:1});
                }
    
                //2. Guarda en archivo
                await fs.writeFile(this.path, JSON.stringify(this.carts));
                console.log(`Producto con ID:${prod_id} agregado exitosamente al carrito ${cart_id}`);
                return {result:`Producto con ID:${prod_id} agregado exitosamente al carrito ${cart_id}`};         
            }
            else{
                return {error:"Carrito no encontrado"};
            }

        } catch (error) {
            console.log("ERROR: "+ error);
            return {error : error};
        }        
    } */

    async updateProductInCart(cart_id, prod_id){

        try {
            //  Buscar el Cart
            const cart_encontrado = await cartModel.findById(cart_id);

            if(cart_encontrado){
                let cart_index = cart_encontrado.findIndex((cart => cart.id === cart_id));

                //  Buscar el producto
                const prod_encontrado = cart_encontrado[cart_index].products.find(prod=> prod.id === prod_id);


                // Si lo encuentra Aumentar cantidad
                if(prod_encontrado){
                    let prod_index = cart_encontrado[cart_index].products.findIndex((prod => prod.id === prod_id));
                    let quantity = cart_encontrado[cart_index].products[prod_index].quantity;
                    cart_encontrado[cart_index].products[prod_index] = {id: prod_id, quantity: quantity+1}

                }// Si no agregarlo al carrito
                else{
                    cart_encontrado[cart_index].products.push({id:prod_id, quantity:1});
                }
    
                //2. Guarda en DB
                await await cartModel.updateOne({_id:cart_encontrado.id}, {$set:cart_encontrado})        
            }
            else{
                return {error:"Carrito no encontrado"};
            }

        } catch (error) {
            console.log("ERROR: "+ error);
            return {error : error};
        }        
    }


}

module.exports = CartManager;