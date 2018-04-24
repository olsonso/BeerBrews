const mongoose = require('mongoose');

const BeerScheme = mongoose.Schema({
  name:{
    type:String,
    required: true
  },
  beers:{
    type:String,
    required: true
  },
  location:{
    type:String,
    required: true
  },
  picture:{
    type:String,
    default:'n/a'
  },
  rating:{
    type:Number,
    required: true,
    min:1,
    max:5
  },
  ownerId:{
    type:String,
    default: 'n/a'
  }
},{timestamps:true})

const Beer = mongoose.model('Beer', BeerScheme)
module.exports = { Beer }
