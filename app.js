// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const session = require("express-session");
app.set("trust proxy", 1); //Security requirements from Heroku
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      sameSite: true, //both fe and be are running on the same hostname
      httpOnly: true, //we are not using https
      maxAge: 1200000,
      // secure: true, //session time
    },
    rolling: true,
  })
);

//Keys and JWt

const keys = require('./config/keys');
const { database, port } = keys;
const path = require('path');

//GOOGLE LOGIN
require("./config/passport");
const passport = require("passport");

//Initializes passport
app.use(passport.initialize());
//Initializes passport session
app.use(passport.session());

// default value for title local
const projectName = "FinalProject";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const item = require("./routes/Item-routes");
app.use("/", item);

const auth = require("./routes/auth-routes")
app.use("/", auth);

const cart = require("./routes/cart-routes")
app.use("/", cart);

const order = require("./routes/order-routes")
app.use("/", order);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
