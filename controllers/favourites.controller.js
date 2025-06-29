// Import the favourite model for database operations
const favouritemodel = require("../models/favourite")

// Controller to add a recipe to user's favourites.
const addfavourite = async(req,res)=>{
  try {
    const userId = req.session.user;
    const recipeId = req.params.id;

    if (!userId || !recipeId || recipeId === "null") {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    await favouritemodel.updateOne(
      { user: userId, recipe: recipeId },
      { $set: { user: userId, recipe: recipeId } },
      { upsert: true }
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("Error adding favourite:", err);
    return res.status(500).json({ success: false });
  }
}

// Controller to remove a recipe from user's favourites.
const removefavourite = async(req,res)=>{
  try {
    const userId = req.session.user;
    const recipeId = req.params.id;

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    await favouritemodel.findOneAndDelete({ user: userId, recipe: recipeId });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Remove error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Export the favourite controllers for use in routes
module.exports={addfavourite,removefavourite}