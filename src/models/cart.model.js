const mongoose = require("mongoose");

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({

    products:{
        type: [
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"products",
                    required:true
                },
                quantity:{
                    type: Number,
                    required:true
                }
            }
        ], // {id, products}
        default:[], // {"id":1,"products":[{"id":2,"quantity":2},{"id":3,"quantity":3}]}
    }
});

cartSchema.pre("find", function(){
    this.populate("products.product");
});

const cartModel = mongoose.model(cartCollection, cartSchema);
module.exports = cartModel;