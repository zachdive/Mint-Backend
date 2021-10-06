const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: String,
    category: {
        type: String,
        enum: ["Fruits and vegetables", "Meat and fish", "Dairy and eggs", "Bread and pastry", "Beverages", "Grains"],
    },
    imageUrl: String,
    quantity_available: Number,
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 10
    },
    expire_in: String,
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }, 
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;