const { Schema, model } = require("mongoose");


const farmerSchema = new Schema({


  farmName:  {
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

 


  logoUrl: String,

  products: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    }
  ], 

  


  status: {
    type: String,
    default: 'Waiting Approval',
    enum: ['Waiting Approval', 'Rejected', 'Approved']
  },

});

const Farmer = model("Farmer", farmerSchema);

module.exports = Farmer;