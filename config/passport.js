// const passport = require('passport');
// const JwtStrategy = require('passport-jwt').Strategy; //Local
// const GoogleStrategy = require('passport-google-oauth2').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;

// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const mongoose = require('mongoose');

// const keys = require('./keys');

// const { google, facebook } = keys;
// const { serverURL, apiURL } = keys.app;

// const User = mongoose.model('User');
// const secret = keys.jwt.secret;

// const opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = secret;

// passport.use(
//   new JwtStrategy(opts, (payload, done) => {
//     User.findById(payload.id)
//       .then(user => {
//         if (user) {
//           return done(null, user);
//         }

//         return done(null, false);
//       })
//       .catch(err => {
//         return done(err, false);
//       });
//   })
// );

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       User.findOne({ email: profile.email })
//         .then(user => {
//           if (user) {
//             return done(null, user);
//           }

//           const name = profile.displayName.split(' ');

//           const newUser = new User({
//             provider: 'google',
//             googleId: profile.id,
//             email: profile.email,
//             firstName: name[0],
//             lastName: name[1],
//             imageUrl: profile.picture,
//             password: null
//           });

//           newUser.save((err, user) => {
//             if (err) {
//               return done(err, false);
//             }

//             return done(null, user);
//           });
//         })
//         .catch(err => {
//           return done(err, false);
//         });
//     }
//   )
// );

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: facebook.clientID,
//       clientSecret: facebook.clientSecret,
//       callbackURL: `${serverURL}/${apiURL}/${facebook.callbackURL}`,
//       profileFields: [
//         'id',
//         'displayName',
//         'name',
//         'emails',
//         'picture.type(large)'
//       ]
//     },
//     (accessToken, refreshToken, profile, done) => {
//       User.findOne({ facebookId: profile.id })
//         .then(user => {
//           if (user) {
//             return done(null, user);
//           }

//           const newUser = new User({
//             provider: 'facebook',
//             facebookId: profile.id,
//             email: profile.emails ? profile.emails[0].value : null,
//             firstName: profile.name.givenName,
//             lastName: profile.name.familyName,
//             imageUrl: profile.photos[0].value,
//             password: null
//           });

//           newUser.save((err, user) => {
//             if (err) {
//               return done(err, false);
//             }

//             return done(null, user);
//           });
//         })
//         .catch(err => {
//           return done(err, false);
//         });
//     }
//   )
// );
//GOOGLE LOGIN

const passport = require("passport");
//Local auth using our database
const LocalStrategy = require("passport-local");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

//Passport - Set the user in session
passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

//Passport - Get the user from the session
//req.user
passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);
  });
});

//Passport - Local authentication
passport.use(
  new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, foundUser) => {
      if (err) {
        next(err);
        return;
      }

      if (!foundUser) {
        next(null, false, { message: "Invalid login" });
        return;
      }

      if (!bcrypt.compareSync(password, foundUser.password)) {
        next(null, false, { message: "Invalid login" });
        return;
      }

      next(null, foundUser);
    });
  })
);

//Passport - Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      //The user got authenticated by google
      User.findOne({ googleId: profile.id })
        .then((user) => {
          if (user) {
            //Authenticate and persist in session
            done(null, user);
            return;
          }

          const name = profile.displayName.split(' ');

          User.create({
            // googleId: profile.id,
            // username: profile.emails ? profile.emails[0].value : null,
            // firstName: profile.name.givenName,
            // lastName: "google",
            // imageUrl: profile.photos[0].value,
            // password: "gooogle"
            provider: 'google',
            googleId: profile.id,
            username: profile.email,
            firstName: name[0],
            lastName: name[1],
            imageUrl:  profile.picture ||  profile.photos[0].value,
            password: "pass"
            
          })
            .then((newUser) => {
              //Authenticate and persist in session
              done(null, newUser);
            })
            .catch((err) => done(err)); // closes User.create()
        })
        .catch((err) => done(err)); // closes User.findOne()
    }
  )
);
