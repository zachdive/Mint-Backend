const router = require("express").Router();
const Cart = require("../models/Cart.model");
const Item = require("../models/Item.model");
const User = require("../models/User.model");

router.get("/cart", async (req, res) => {
  try {
    console.log("request", req.session.currentUser);
    const cart = await Cart.find();
    res.status(200).json(cart);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const { itemId, quantity, purchasePrice } = req.body;
    const user = await User.findById(req.session.currentUser._id);
    const item = await Item.findById(itemId);
    console.log("user", user);
    console.log("item", item);
    if (!itemId) {
      res.status(400).message({ message: "missing fields" });
      return;
    }

    let response;

    if (user.cart) {
    } else {
      response = await Cart.create({
        products: [
          {
            item,
            quantity,
            purchasePrice,
          },
        ],
      });

      await User.findByIdAndUpdate(req.session.currentUser._id, {
        cart: response,
      });
    }

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/cart/:id", async (req, res) => {
  try {
    await Cart.findByIdAndRemove(req.params.id);
    res
      .status(200)
      .json({ message: `Cart with id ${req.params.id} was deleted.` });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/usercart", async (req, res) => {
  try {

    const user = await User.findById(req.session.currentUser._id).populate({ 
      path: 'cart',
      populate: {
        path: 'products.item',
        model: 'Item'
      } 
   })
    //const userCart = user.cart.populate("products");
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/cart/:id", async (req, res) => {
  try {
    const { itemId, quantity, purchasePrice } = req.body;
    const user = await User.findById(req.session.currentUser._id);
    const item = await Item.findById(itemId);
    console.log("user", user);
    console.log("item", item);
    if (!itemId) {
      res.status(400).message({ message: "missing fields" });
      return;
    }
    const response = await Cart.findByIdAndUpdate(
      user.cart._id,
      { $push: { products: { item, quantity, purchasePrice } } },
      { new: true } //<= responding with new (updated) object
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
