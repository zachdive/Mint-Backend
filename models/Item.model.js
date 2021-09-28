const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: String,
    category: {
        type: String,
        enum: ["Fruits and vegetables", "Meat and fish", "Dairy and eggs", "Bread and pastry", "Beverages", "Grains"],
    },
    imageUrl: String,
    quantity_available: Number,
    price: Number,
    expire_in: String,
    description: String,
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;