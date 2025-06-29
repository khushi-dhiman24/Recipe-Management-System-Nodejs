const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); 

const contactusSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
  message:{
    type: String,
    required: true
  }
  })
// Attach the plugin
contactusSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('contactus', contactusSchema);

