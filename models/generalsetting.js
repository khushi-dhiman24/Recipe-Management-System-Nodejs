const mongoose = require('mongoose');

const generalSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true
    },
    com_name:{
        type: String,
        required: true
    },
    com_email:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    description:{
        type: String,
        require: true,
        maxlength:500
    },
    phone:{
        type: String,
        required: true
    },
    copyright:{
        type: String,
        required: true
    }
});


module.exports = mongoose.model('general', generalSchema)

