const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); 

const reviewSchema = new mongoose.Schema({
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  comment: { 
    type: String, 
    required: true 
},
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
},
  date: { 
    type: Date, 
    default: Date.now 
},
  status: {
    type:Boolean,
    default: true 
},
},{ timestamps: true });

// Attach the plugin
reviewSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Review', reviewSchema);
