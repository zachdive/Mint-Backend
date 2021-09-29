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
    const { cart, schedule_delivery, total, status} = req.body;

    if(!cart || !schedule_delivery || !total || !status) {
        res.status(400).message({message: "missing fields"});
        return;
    }
    
    try{
        const response = await Order.create({cart, schedule_delivery, total, status});
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.delete("/orders/:id", async (req, res) => {
    try{
        await Order.findByIdAndRemove(req.params.id);
        res
            .status(200)
            .json({message: `Order with id ${req.params.id} was deleted.`})
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.get("/orders/:id", async (req,res) => {
    try {
        const response = await Order.findById(req.params.id);
        res
            .status(200)
            .json(response)
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.put("/orders/:id", async (req,res) => {
    const { cart, schedule_delivery, total, status } = req.body;

    if(!cart || !schedule_delivery || !total || !status) {
        res.status(400).message({message: "missing fields"});
        return;
    }

    try {
        const response = await Order.findByIdAndUpdate(
            req.params.id, 
            {
                cart, 
                schedule_delivery, 
                total, 
                status
            }, 
            {new: true} //<= responding with new (updated) object
        );
        res
        .status(200).json(response)
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

module.exports = router;