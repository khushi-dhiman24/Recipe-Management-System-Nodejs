const mongoose = require('mongoose');

const sociallinkSchema = new mongoose.Schema({
    facebook: String,
    twitter: String,
    instagram: String,
    youtube:String
})

module.exports = mongoose.model('sociallink', sociallinkSchema)

