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

//List of users
router.get("/users", async (req, res) => {
  try{
      const users = await User.find().populate("farmItems");
      res.status(200).json(users);
  } catch(e){
      res.status(500).json({message: e.message});
  }
});


router.put("/user/:id", async (req, res) => {
const {firstName, lastName, phoneNumber, farmerAdress, city, zipCode, imageUrl} = req.body;
    if(!firstName || !lastName || !phoneNumber || !farmerAdress || !city || !zipCode){
        res.status(400).json({message: "missing fields"});
        return;
    }
    try {
        const response = await User.findByIdAndUpdate(req.params.id, {
            firstName, 
            lastName, 
            phoneNumber, 
            farmerAdress, 
            city, 
            zipCode,
             imageUrl, 
        },
            {new: true}
        );
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});



//Signup
router.post("/signup", async (req, res) => {

  try {
  const { firstName, lastName,  password, phoneNumber, username, isFarmer, zipCode, city, farmerAdress, imageUrl} = req.body;
  if (username === "" || password === "") {
    res.status(400).json({ errorMessage: "Fill email and password" });
    return;
  }
  
  const emailAfterAt = username.substring(username.length, username.indexOf('@'));
  if(! emailAfterAt.includes('.')) {
    res.json('invalid email');
    return;
  }

  // Password constrain

  // const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (passwordRegex.test(password) === false) {
  //   res.status(200).json('weak password');
  //   return;
  // }

  const user = await User.findOne({ username });
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
    username,
    isFarmer,
    zipCode,
    city,
    farmerAdress,
    imageUrl,
  });

  
  
  
  res.status(200).json(
    newUser,
  );

} catch (error) {
  res.status(400).json({
    error: `Your request could not be processed. Please try again. ${error}`
  });
}

});




// //Login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   if (email === "" || password === "") {
//     res.status(400).json({ errorMessage: "Fill email and password" });
//     return;
//   }
//   const user = await User.findOne({ email });
//   if (user === null) {
//     res.status(401).json({ errorMessage: "No user found for this email adress" });
//     return;
//   }
//   if (bcrypt.compareSync(password, user.password)) {
//     //passwords match - login successful
//     req.session.currentUser = user;
//     res.status(200).json(user);
//   } else {
//     res.status(401).json({ errorMessage: "Invalid login" });
//   }
// });

// router.post("/logout", (req, res) => {
//   req.session.destroy();
//   res.status(200).json({message: "user logged out"});
// });

// router.get("/isloggedin", (req, res) => {
//     if(req.user) {
//         res.status(200).json(req.user);
//     }else{
//         res.status(200).json({});
//     }
// })

//GOOGLE LOGIN
 
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, theUser, failureDetails) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Something went wrong authenticating user" });
      return;
    }
    if (!theUser) {
      // "failureDetails" contains the error messages
      // from our logic in "LocalStrategy" { message: '...' }.
      res.status(401).json(failureDetails);
      return;
    }
    // save user in session
    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: "Session save went bad." });
        return;
      }
      // We are now logged in (that's why we can also send req.user)
      res.status(200).json(theUser);
    });
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  req.logout();
  res.status(200).json("logout success");
});

router.get("/isloggedin", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(200).json({});
});

router.get(
  'auth/google', (req , res)=> {
    res.status(200).json({message:"GOOOGLE"})
  }
);


router.get(
  '/auth/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
    accessType: 'offline',
    approvalPrompt: 'force'
  })
);

// router.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: [
//       "https://www.googleapis.com/auth/userinfo.profile",
//       "https://www.googleapis.com/auth/userinfo.email",
//     ],
//   })
// );

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.CLIENT_HOSTNAME}/products`,
    failureRedirect: `${process.env.CLIENT_HOSTNAME}/login`,
  })
);

    // jwt.sign(payload, secret, { expiresIn: tokenLife }, (err, token) => {
    //   const jwt = `Bearer ${token}`;

    //   const htmlWithEmbeddedJWT = `
    // <html>
    //   <script>
    //     // Save JWT to localStorage
    //     window.localStorage.setItem('token', '${jwt}');
    //     // Redirect browser to root of application
    //     window.location.href = '/auth/success';
    //   </script>
    // </html>       
    // `;

    //   res.send(htmlWithEmbeddedJWT);
    // });
//   }
// );



module.exports = router;