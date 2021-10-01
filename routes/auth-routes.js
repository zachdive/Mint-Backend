const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');

//Models, Middlewares & Helpers
const User = require("../models/User.model");
const auth = require('../middleware/auth')

//Keys
const keys = require('../config/keys')
const { secret, tokenLife } = keys.jwt;



//Signup
router.post("/signup", async (req, res) => {

  try {
  const { firstName, lastName,  password, phoneNumber, email, isFarmer } = req.body;
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
    email,
    isFarmer,
  });

  
  // const registeredUser = await newUser.save();
  // const payload = {
  //   id: registeredUser.id
  // };
  const token = jwt.sign(payload, secret, { expiresIn: tokenLife });
  
  res.status(200).json({
    success: true,
    token: `Bearer ${token}`,
    newUser,
  });

} catch (error) {
  res.status(400).json({
    error: 'Your request could not be processed. Please try again.'
  });
}

});




//Login
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



router.get(
  'auth/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
    accessType: 'offline',
    approvalPrompt: 'force'
  })
);

router.get(
  'auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const payload = {
      id: req.user.id
    };

    jwt.sign(payload, secret, { expiresIn: tokenLife }, (err, token) => {
      const jwt = `Bearer ${token}`;

      const htmlWithEmbeddedJWT = `
    <html>
      <script>
        // Save JWT to localStorage
        window.localStorage.setItem('token', '${jwt}');
        // Redirect browser to root of application
        window.location.href = '/auth/success';
      </script>
    </html>       
    `;

      res.send(htmlWithEmbeddedJWT);
    });
  }
);

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    session: false,
    scope: ['public_profile', 'email']
  })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/',
    session: false
  }),
  (req, res) => {
    const payload = {
      id: req.user.id
    };

    jwt.sign(payload, secret, { expiresIn: tokenLife }, (err, token) => {
      const jwt = `Bearer ${token}`;

      const htmlWithEmbeddedJWT = `
    <html>
      <script>
        // Save JWT to localStorage
        window.localStorage.setItem('token', '${jwt}');
        // Redirect browser to root of application
        window.location.href = '/auth/success';
      </script>
    </html>       
    `;

      res.send(htmlWithEmbeddedJWT);
    });
  }
);


module.exports = router;