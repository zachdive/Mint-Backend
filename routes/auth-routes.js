const router = require("express").Router();
const bcrypt = require("bcryptjs");
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const passport = require('passport');

//Models, Middlewares & Helpers
const User = require("../models/User.model");
const auth = require('../middleware/auth')




router.post("/signup", async (req, res) => {
  const { firstName, lastName,  password, phoneNumber, email } = req.body;
  if (email === "" || password === "") {
    res.status(400).json({ errorMessage: "Fill email and password" });
    return;
  }
  const user = await User.findOne({ email });
  if (user !== null) {
    //found the user, it already exists
    res.status(400).json({ errorMessage: "User already exists" });
    return;
  }
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const newUser = await User.create({
    firstName,
    lastName,
    password: hashedPassword,
    phoneNumber,
    email
  });
  res.status(200).json(newUser);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(400).json({ errorMessage: "Fill email and password" });
    return;
  }
  const user = await User.findOne({ email });
  if (user === null) {
    res.status(401).json({ errorMessage: "Invalid login" });
    return;
  }
  if (bcrypt.compareSync(password, user.password)) {
    //passwords match - login successful
    req.session.currentUser = user;
    res.status(200).json(user);
  } else {
    res.status(401).json({ errorMessage: "Invalid login" });
  }
});
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({message: "user logged out"});
});
router.get("/isloggedin", (req, res) => {
    if(req.session.currentUser) {
        res.status(200).json(req.session.currentUser);
    }else{
        res.status(200).json({});
    }
})
module.exports = router;