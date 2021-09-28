const { Schema, model } = require("mongoose");


const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
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
    required: true
  },

  imageUrl: String,

  
  //Location: Google Maps API? (we may have to make a coord model)

  isFarmer: {
    type: Boolean,
    default: false
  },

});

const User = model("User", userSchema);

module.exports = User;
