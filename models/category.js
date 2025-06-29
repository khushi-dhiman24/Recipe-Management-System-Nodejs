const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); 

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    slug: {
       type: String,
       required: true,
       unique: true
    },
    status: {
        type:Boolean
        // boolean:true,
        // require: true
    }

})

// Attach the plugin
categorySchema.plugin(aggregatePaginate);

module.exports = mongoose.model('category',categorySchema)

