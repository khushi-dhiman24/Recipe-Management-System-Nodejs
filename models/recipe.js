const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); 

const recipeSchema = mongoose.Schema({
  image: String,
  name: String,
  pre_time: String,
  cook_time: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref:"category" },
  cuisine: { type: mongoose.Schema.Types.ObjectId, ref:"cuisine" },
  cooking_method: { type: mongoose.Schema.Types.ObjectId, ref:"cooking" },
  gallery: [{
    type: String
  }],
  slug: {
  type: String,
  required: true,
  unique: true
},
  serving: String,
  difficulty: String, enum: ['Beginner', 'Intermediate', 'Expert'],
  video: String,
  description: String,
  ingredient: {
    type: [
      {
        name: {
          type: String
        },
        value: {
          type: Number
        },
        unit: {
          type: mongoose.Schema.Types.ObjectId,
          ref:'nutritionunit'
        },
        _id: false
      }
    ]
  },
  cooking_step: [{
    type: String,
    required: true
  }],
  nutrition: {
    type: [
      {
        name: {
          type: mongoose.Schema.Types.ObjectId,
          ref:'nutrition'
        },
        value: {
          type: Number
        },
        unit: {
          type: mongoose.Schema.Types.ObjectId,
          ref:'nutritionunit'
        },
        _id: false
      }
    ]
  },
  status: {
    type: Number,
    // boolean: true,
    required: true
  }
});

recipeSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Recipe', recipeSchema);

