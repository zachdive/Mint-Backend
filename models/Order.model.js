const { Schema, model } = require ("mongoose");

const orderSchema = new Schema (
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        cart: 
            {
            type: Schema.Types.ObjectId,
            ref: "Cart"
            }
        ,
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