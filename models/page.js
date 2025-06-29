const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2'); 

const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    header: { 
        type: Boolean, 
        default: false 
    },
    footer: { 
        type: Boolean, 
        default: false 
    },
    slug: {
       type: String,
       required: true,
       unique: true
    },
    status: {
        type:Boolean,
        // boolean:true,
        // require: true
    }
})

// Attach the plugin
pageSchema.plugin(paginate);

module.exports = mongoose.model('page',pageSchema)

