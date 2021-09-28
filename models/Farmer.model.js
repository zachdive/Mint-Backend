const { Schema, model } = require("mongoose");


const farmerSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  bio: String,

  //Location: Google Maps API? (we may have to make a coord model)


  zipcode: {
    type: String,
    required: true
  },

  taxpayerNumber: {
    type: Number,
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

  logoUrl: String,

  products: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    }
  ], 

  

  isFarmer: {
    type: Boolean,
    default: true
  },

});

const Farmer = model("Farmer", farmerSchema);

module.exports = Farmer;