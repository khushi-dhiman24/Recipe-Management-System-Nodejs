const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2'); 

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// Attach the plugin
countrySchema.plugin(paginate);

module.exports = mongoose.model('country',countrySchema)

