const router = require("express").Router();
const Order = require("../models/Order.model");

router.get("/my-order", (req, res) => {
    try {
        res.status(200).json();
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

module.exports = router;