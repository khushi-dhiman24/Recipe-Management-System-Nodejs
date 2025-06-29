const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: String,
    sub_title: String,
    image: String, // path to uploaded image
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });


module.exports = mongoose.model('banner', bannerSchema)

