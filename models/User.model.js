const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: Number,
  },

  username: { //is actually email
    type: String,
    unique: true,
    // required: () => {
    //   return this.provider !== 'email' ? false : true;
    // }
  },

  provider: {
    type: String,
    required: true,
    default: 'email'
  },

  googleId: {
    type: String
  },
  facebookId: {
    type: String
  },

  farmItems: [
    {
    type: Schema.Types.ObjectId,
    ref:"Item",
    },
  ],

  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],

  cart: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
  },

  imageUrl: {
    type:String,
    default: 'https://images.pexels.com/photos/7288781/pexels-photo-7288781.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
  },
  
  //Location: Google Maps API? (we may have to make a coord model)

  isFarmer: {
    type: Boolean,
    default: false,
  },

  farmerAdress: String,
  city: String,
  zipCode: String,

  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

const User = model("User", userSchema);

module.exports = User;
