const router = require("express").Router();
const Order = require("../models/Order.model");

router.get("/orders", async (req, res) => {
    try {const orders = await Order.find();
        res.status(200).json(orders);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.post("/orders", async (req, res) => {
    const {user, cart, schedule_delivery, total, status} = req.body;

    if(!user || !cart || !schedule_delivery || !total || !status) {
        res.status(400).message({message: "missing fields"});
        return;
    }
    
    try{
        const response = await Order.create({user, cart, schedule_delivery, total, status});
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

module.exports = router;