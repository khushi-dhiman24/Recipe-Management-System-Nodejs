const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); 

const commentSchema =new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  user: {
    type:  mongoose.Schema.Types.ObjectId, 
    ref: 'user',
    required: true
  },
  recipe: {
    type:  mongoose.Schema.Types.ObjectId, 
    ref: 'Recipe',
    required: true
  },
  parentId: {
    type:  mongoose.Schema.Types.ObjectId, 
    ref: 'Comment',
    default: null
  },
  status: {
    type:Boolean,
    default: true 
  },
  date: {
    type: Date,
    default: Date.now
  }
},{ timestamps: true });

// Attach the plugin
commentSchema.plugin(aggregatePaginate);
module.exports = mongoose.model('Comment', commentSchema);
