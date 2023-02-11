const fs = require("fs/promises");


class ProductManager{

    static id_contador = 6;

    constructor(ruta_archivo){

        this.products = [];
        this.path = ruta_archivo;

    }


    async addProduct({ title, description, price, thumbnail, code, stock }){

        if (!title || !description || !price || !thumbnail || !code || !stock){
            return console.log("Producto Invalido, se requieren todos los campos");
        }
        if((title=='' || description=='' || price=='' || thumbnail=='' || code=='' || stock=='')){
            return console.log("Producto Invalido, se requieren todos los campos");
        }

        //1. leer archivo
        this.products = await this.getProducts();

        const validateCode = this.products.some(product => product.code === code);
        if(validateCode){
            return console.log("Producto con Código ya existente");
        }
        
        const id = ProductManager.id_contador;
        this.products.push({id, title, description, price, thumbnail, code, stock});
        ProductManager.id_contador = ProductManager.id_contador + 1;

        //2. Guarda en archivo
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products));
            
        } catch (error) {
            return console.log("ERROR: "+ error);
        }
        console.log("Producto agregado al carrito");
    }


    async getProducts(){

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
            return console.log("ERROR: "+ error);
        }    
    }


    async getProductById(id){

        //1. leer archivo
        this.products = await this.getProducts();

        const encontrado = this.products.find(product => product.id === id);

        if(encontrado){
            return encontrado;
        }
        else{
            return {error:"Producto no encontrado"};
        }
    }

    async updateProduct(id, producto){

        try {
            const encontrado = await this.getProductById(id);

            if(encontrado){
                let index = this.products.findIndex((prod => prod.id == id));
                this.products[index] = {id,...producto};
    
                //2. Guarda en archivo
                await fs.writeFile(this.path, JSON.stringify(this.products));
                console.log(`Producto con ID:${id} modificado exitosamente`);            
            }

        } catch (error) {
            return console.log("ERROR: "+ error);
        }        
    }

    async deleteProduct(id){
        try {
            const encontrado = await this.getProductById(id);
            if(encontrado){
                let index = this.products.findIndex((prod => prod.id == id));
                this.products.splice(index, 1);

                //2. Guarda en archivo
                await fs.writeFile(this.path, JSON.stringify(this.products));
                console.log(`Producto con ID:${id} eliminado exitosamente`); 
            }
        } catch (error) {
            return console.log("ERROR: "+ error);
        }
    }


    /* async exists(f) {
        try {
            await fs.promises.stat(f);
            return true;
        } catch {
            return false;
        }
    } */

}

module.exports = ProductManager;