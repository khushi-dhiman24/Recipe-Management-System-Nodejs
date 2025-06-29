const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); 

const cuisineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type:Boolean,
        // boolean:true,
        // require: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
})

// Attach the plugin
cuisineSchema.plugin(aggregatePaginate);


module.exports = mongoose.model('cuisine',cuisineSchema)

