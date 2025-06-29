const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
}, { timestamps: true });



module.exports = mongoose.model('Favourite', favouriteSchema);