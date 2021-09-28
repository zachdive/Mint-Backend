const router = require("express").Router();
const Order = require("../models/Order.model");

router.get("/orders", async (req, res) => {
    try {const orders = await Order.find();
        res.status(200).json(orders);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

module.exports = router;