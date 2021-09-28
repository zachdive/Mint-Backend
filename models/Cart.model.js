const { Schema, model } = require ("mongoose");

const CartSchema = new Schema(
    {
        
        products: {
            product:{
                type: Schema.Types.ObjectId,
                ref:"Item"
            },            
            quantity: Number
            ,
            purchasePrice: {
                type: Number,
                default: 0
            },
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        created: {
            type: Date,
            default: Date.now
        },
        totalPrice: {
            type: Number,
            default: 0
        },
        deliveryFee: {
            type: Number,
            default: 3.95
        },
        status: {
            type: String,
            default: 'Not processed',
            enum: ['Not processed', 'Processed'],
        },
    }
)

const Cart = model("Cart", CartSchema);

module.exports = Cart;