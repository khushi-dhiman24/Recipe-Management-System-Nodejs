const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
    section_name:{
        type: String,
        required: true
    },
    heading:{
        type: String,
        required: true
    },
    sub_heading:{
        type: String
    },
    total_item:{
        type: Number,
        required: true
    },
    status: {
        type:Boolean,
        // boolean:true,
        // require: true
    }
})


module.exports = mongoose.model('home', homeSchema)

