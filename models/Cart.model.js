const { Schema, model } = require ("mongoose");

const CartSchema = new Schema(
    {        
        products: [{
            item:{
                type: Schema.Types.ObjectId,
                ref:"Item"
            },            
            quantity: {
                type: Number,
                default: 0
            }
            ,
            purchasePrice: {
                type: Number,
                default: 0
            },
        }],
        deliveryFee: {
            type: Number,
            default: 3.95
        },
        totalPrice: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            default: 'Not processed',
            enum: ['Not processed', 'Processed'],
        },
    }, {timestamps: true}
)

const Cart = model("Cart", CartSchema);

module.exports = Cart;