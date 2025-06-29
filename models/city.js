const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); 


const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    state:{type:mongoose.Schema.Types.ObjectId,ref:"state"}
})

// Attach the plugin
citySchema.plugin(aggregatePaginate);

module.exports = mongoose.model('city',citySchema)

