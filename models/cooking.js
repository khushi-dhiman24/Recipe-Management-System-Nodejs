const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); 

const cookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type:Boolean,
        // boolean:true,
        // require: true
    }
})

// Attach the plugin
cookingSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('cooking',cookingSchema)

