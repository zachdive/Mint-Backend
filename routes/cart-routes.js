const router = require("express").Router();
const Cart = require("../models/Cart.model");

router.get("/cart", async (req,res) => {
    try {
        console.log("request", req.session.currentUser);
        const cart = await Cart.find();
        res.status(200).json(cart);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.post("/cart", async (req, res) => {
    const {products, user, totalPrice} = req.body;

    if(!products || !user || !totalPrice) {
        res.status(400).message({message: "missing fields"});
        return;
    }
    
    try{
        const response = await Cart.create({products, user, totalPrice});
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.delete("/cart/:id", async (req, res) => {
    try{
        await Cart.findByIdAndRemove(req.params.id);
        res
            .status(200)
            .json({message: `Cart with id ${req.params.id} was deleted.`})
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.get("/cart/:id", async (req,res) => {
    try {
        const response = await Cart.findById(req.params.id);
        res
            .status(200)
            .json(response)
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.put("/cart/:id", async (req,res) => {
    const {products, totalPrice} = req.body;

    if(!products || !totalPrice) {
        res.status(400).json({message: "missing fields"});
        return;
    }

    try {
        const response = await Cart.findByIdAndUpdate(
            req.params.id, 
            {
                products,
                totalPrice,
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