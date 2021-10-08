const router = require("express").Router();
const Cart = require("../models/Cart.model");
const Order = require("../models/Order.model");
const User = require("../models/User.model");

router.get("/orders", async (req, res) => {
    try {
        console.log("current user")
        const response = await User.findById(req.user._id).populate({
            path: "orders",
            populate: {
              path: "userProducts.item",
              model: "Item",
            },
          });
          console.log("current user", response)
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.put("/orders", async (req, res) => {
    const { userProducts, schedule_delivery, total, address, payment } = req.body;

    if(!userProducts || !schedule_delivery || !total || !address || !payment) {
        res.status(400).json({message: "missing fields"});
        return;
    }
    
    try{
      
        console.log(req.user)
        const user = await User.findById(req.user._id).populate({
            path: "cart",
            populate: {
              path: "products.item",
              model: "Item",
            },
          });
        
        // const productsArray = user.cart.products.forEach((product) =>)
        const order = await Order.create({ userProducts, schedule_delivery, total, address, payment });
        
        
        let response;

        
        
        if(user.order){
            await Cart.findByIdAndDelete(user.cart._id);
            await User.findByIdAndUpdate(req.user._id, {$unset: { cart: 1 }});
            response = await User.findByIdAndUpdate(req.user._id, {orders: order, cart: undefined}, {new: true});
            // response = delete newUser.cart;
            // await User.findByIdAndUpdate(req.user._id, response);
        }else{
            await Cart.findByIdAndDelete(user.cart._id);
            await User.findByIdAndUpdate(req.user._id, {$unset: { cart: 1 }});
            response = await User.findByIdAndUpdate(req.user._id, {$push:{orders: order}}, {new: true});
        }
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