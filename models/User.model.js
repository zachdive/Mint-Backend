const { Schema, model } = require("mongoose");


const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },


  password: {
    type: String,
    required: true
  },

  phoneNumber: {
    type: Number,
    required:true
  },

  email: {
    type: String,
    unique: true,
    // required: () => {
    //   return this.provider !== 'email' ? false : true;
    // }
  },

  // provider: {
  //   type: String,
  //   required: true,
  //   default: 'email'
  // },

  // googleId: {
  //   type: String
  // },
  // facebookId: {
  //   type: String
  // },

  orders: [
    {
    type: Schema.Types.ObjectId,
    ref: "Order"
    }
  ],
  
  cart: 
  {
  type: Schema.Types.ObjectId,
  ref: "Cart"
  }
  ,

  imageUrl: String,

  
  //Location: Google Maps API? (we may have to make a coord model)

  isFarmer: {
    type: Boolean,
    default: false
  },

  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }

});

const User = model("User", userSchema);

module.exports = User;
