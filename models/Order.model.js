const { Schema, model } = require ("mongoose");

const orderSchema = new Schema (
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        cart: [
            {
            type: Schema.Types.ObjectId,
            ref: "Item"
            }
        ],
        schedule_delivery: {
            date: Date,
            time: {
                type: String,
                enum: ["Morning(8-12h)", "Noon (12-16h)", "Evening (16-20h)"]
            }
        },
        delivery_fee: {
            type: String,
            default: "3,95"
        },
    },
    {
    timestamps: true,
    },
);

const Order = model("Order", orderSchema);

module.exports = Order;