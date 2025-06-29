const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); 

const stateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country:{type:mongoose.Schema.Types.ObjectId,ref:"country"}
})

// Attach the plugin
stateSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('state',stateSchema)

