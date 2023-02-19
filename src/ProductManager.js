const fs = require("fs/promises");


class ProductManager{


    constructor(ruta_archivo){

        this.products = [];
        this.path = ruta_archivo;

    }

    async addProduct({ title, description, code, price, stock, category, thumbnails, status=true }){

        if (!title || !description || !code || !price || !stock || !category ){
            console.log("Producto Invalido, se requieren todos los campos");
            return { error : "Producto Invalido, se requieren todos los campos"};
            
        }
        if((title=='' || description=='' || code=='' || price=='' || stock=='' || category=='')){
            console.log("Producto Invalido, se requieren todos los campos");
            return { error : "Producto Invalido, se requieren todos los campos"};
        }

        //1. leer archivo
        this.products = await this.getProducts();

        const validateCode = this.products.some(product => product.code === code);
        if(validateCode){
            console.log("Producto con Código ya existente");
            return { error : "Producto con Código ya existente"};
        }
        
        // Generar ID autoincremental
        let id = this.products.length > 0 ? this.products[this.products.length-1].id + 1 : 1;
        this.products.push({id, title, description, code, price, stock, category, thumbnails, status});
        

        //2. Guarda en archivo
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products));
            
        } catch (error) {
            console.log("ERROR: "+ error);
            return { error : error};
        }
        console.log("Producto agregado al carrito");
        return { result : "Producto agregado al carrito"};
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
            console.log("ERROR: "+ error);
            return {error : error};
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
            console.log("Producto no encontrado")
            return {error:"Producto no encontrado"};
        }
    }

    async updateProduct(id, producto){

        if (!producto.title || !producto.description || !producto.code || !producto.price || !producto.stock || !producto.category ){
            console.log("Producto Invalido, se requieren todos los campos");
            return { error : "Producto Invalido, se requieren todos los campos"};
            
        }
        if((producto.title=='' || producto.description=='' || producto.code=='' || producto.price=='' || producto.stock=='' || producto.category=='')){
            console.log("Producto Invalido, se requieren todos los campos");
            return { error : "Producto Invalido, se requieren todos los campos"};
        }

        try {
            const encontrado = await this.getProductById(id);

            if(!encontrado.error){
                let index = this.products.findIndex((prod => prod.id == id));
                this.products[index] = {id,...producto};
    
                //2. Guarda en archivo
                await fs.writeFile(this.path, JSON.stringify(this.products));
                console.log(`Producto con ID:${id} modificado exitosamente`);
                return {result:`Producto con ID:${id} modificado exitosamente`};         
            }
            else{
                return {error:"Producto no encontrado"};
            }

        } catch (error) {
            console.log("ERROR: "+ error);
            return {error : error};
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
                return {result:`Producto con ID:${id} eliminado exitosamente`}; 
            }
        } catch (error) {
            console.log("ERROR: "+ error);
            return {error : error};
        }
    }

    //TODO Convert to Sync
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