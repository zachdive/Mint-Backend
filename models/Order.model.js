const { Schema, model } = require ("mongoose");

const orderSchema = new Schema (
    {
       
        userProducts: [{
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
        schedule_delivery: {
            date: Date,
            time: {
                type: String,
                enum: ["Morning(8-12h)", "Noon (12-16h)", "Evening (16-20h)"]
            }
        },
        total: {
            type: Number,
            default: 0,
        },
        created: {
            type: Date,
            default: Date.now
        },
        address:{
            city: String,
            address: String,
            zipCode: String,
        },
        payment:{
            name: String,
            cardNumber: Number,
            cardSecureNumber: Number,
            cardType: {
                type: String,
                enum: ["MasterCard", "VISA", "AmericanExpress"],
            },

        },
        status: {
            type: String,
            default: 'Not processed',
            enum: ['Not processed', 'Processing', 'Delivering','Delivered', 'Cancelled']
        }
    },
    {
    timestamps: true,
    },
);

const Order = model("Order", orderSchema);

module.exports = Order;