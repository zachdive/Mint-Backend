const router = require("express").Router();
const Item = require("../models/Item.model");
const User = require("../models/User.model");
const fileUpload = require('../config/cloudinary');


router.get("/products", async (req, res) => {
    try{
        const items = await Item.find();
        res.status(200).json(items);
    } catch(e){
        res.status(500).json({message: e.message});
    }
});

router.post("/products", async (req, res) => {
    const {name, category, imageUrl, quantity_available, price, expire_in, description} = req.body;

    if(!name || !category || !quantity_available || !price || !expire_in || !description){
        res.status(400).json({message: "missing fields"});
        return;
    }
    try {
        const response = await Item.create({user: req.user, name, category, imageUrl, quantity_available, price, expire_in, description});
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
              farmItems: response,
            },
        });
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.delete("/products/:id", async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.status(200).json({message: `Item with id ${req.params.id} was deleted.`});
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.get("/products/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        res.status(200).json(item);
    } catch(e) {
        res.status(500).json({message: e.message});
    }

});

router.put("/products/:id", async (req, res) => {
    const {name, category, imageUrl, quantity_available, price, expire_in, description} = req.body;
    if(!name || !category || !quantity_available || !price || !expire_in || !description){
        res.status(400).message({message: "missing fields"});
        return;
    }
    try {
        const response = await Item.findByIdAndUpdate(req.params.id, {
            name, 
            category, 
            imageUrl, 
            quantity_available, 
            price, 
            expire_in, 
            description
        },
            {new: true}
        );
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.post("/upload", fileUpload.single("file"), (req, res) => {
    try {
        res.status(200).json({fileUrl: req.file.path});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

module.exports = router;