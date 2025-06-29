const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); 

const nutritionunitSchema = new mongoose.Schema({
    unit: {
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
nutritionunitSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('nutritionunit',nutritionunitSchema)

