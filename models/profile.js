const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  adminname: {
    type: String,
    required: true
  },
  adminemail:{
    type: String,
    required: true
  },
  adminusername:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true,
    minlength:10
  }
},{ timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);

