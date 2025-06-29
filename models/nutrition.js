const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); 

const nutritionSchema = new mongoose.Schema({
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
nutritionSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('nutrition',nutritionSchema)

