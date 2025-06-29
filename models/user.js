const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); 

const userSchema = mongoose.Schema({
  image:{
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  status: {
    type:Boolean,
    // boolean:true,
    require: true
  },
  address:{
    type: String,
    // required: true
  },
  isBlocked: {
   type: Boolean,
   default: false
  },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  city: { type: mongoose.Schema.Types.ObjectId, ref:"city" },
  state: { type: mongoose.Schema.Types.ObjectId, ref:"state" },
  country: { type: mongoose.Schema.Types.ObjectId, ref:"country" }
})
// Attach the plugin
userSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('user', userSchema);

