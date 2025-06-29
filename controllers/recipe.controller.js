// Import all required models for recipe operations
const recipemodel = require("../models/recipe")
const categorymodel = require("../models/category")
const cuisinemodel = require("../models/cuisine")
const cookingmodel = require("../models/cooking")
const nutritionmodel = require("../models/nutrition")
const nutritionunitmodel = require("../models/nutritionunit")
const slugify = require('slugify');

// Controller to show all recipes (paginated).
const allrecipe = async (req, res) => { 
  try {
    const { page = 1, limit = 5 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const aggregate = recipemodel.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          image: 1,
          name: 1,
          category: 1,
          status: 1
        }
      }
    ]);

    const options = {
      page: pageNumber,
      limit: limitNumber
    };

    const result = await recipemodel.aggregatePaginate(aggregate, options);

    return res.render('admin/recipe', {
      recipes: result.docs,
      totalrecipe: result.totalDocs,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });

  } catch (err) {
    res.send(err.message);
  }
};

// Controller to render the add recipe form.
const addrecipe = async (req,res)=>{
  try{
    const categories = await categorymodel.find()
    const cuisines = await cuisinemodel.find()
    const cooking = await cookingmodel.find()
    const nutritionunit = await nutritionunitmodel.find()
    const nutrition = await nutritionmodel.find()
    return res.render('admin/addrecipe',{categories,cuisines,cooking,nutritionunit,nutrition})
  }catch (error) {
    return res.status(500).send(error);
  }
};

// Controller to create a new recipe.
const createrecipe = async (req,res)=>{
try {
    let {
      name, description, pre_time, cook_time, category,
      cuisine, cooking_method, serving, difficulty,
      video, ingredient, cooking_step, nutrition, status
    } = req.body;
    // console.log(req.body)

    const image = req.file?.filename;
    const Status = (status === 'Publish') ? true : false;
    const slug = slugify(name, { lower: true, strict: true });

    const ingredients = req.body.ingredient.map(i => ({
      name: i.name,
      value: Number(i.value),
      unit: i.unit
    }));

    const nutritions = req.body.nutrition.map(i => ({
      name: i.name,
      value: Number(i.value),
      unit: i.unit
    }));

    let data = await recipemodel.create({
      image,
      name,
      slug,
      description,
      pre_time,
      cook_time,
      category,
      cuisine,
      cooking_method,
      serving,
      difficulty,
      video,
      ingredient: ingredients,
      cooking_step,
      nutrition: nutritions,
      status: Status
    });
    // console.log(data)

    return res.redirect('/admin/recipe');
  } catch (err) {
    return res.send(err.message);
  }
};

// Controller to render the edit recipe form.
const editrecipe = async (req,res)=>{
    try {
      const categories = await categorymodel.find()
      const cuisines = await cuisinemodel.find()
      const cooking = await cookingmodel.find()
      const nutritionunit = await nutritionunitmodel.find()
      const nutrition = await nutritionmodel.find()
      const recipe = await recipemodel.findById(req.params.id);
  
      if (!recipe) {
        return res.status(404).send("recipe not found");
      }
  
      return res.render('admin/updaterecipe', {recipe,categories,cuisines,cooking,nutritionunit,nutrition});
    } catch (error) {
      console.error("Error fetching recipe:", error);
      return res.status(500).send("Server error");
    }
};

// Controller to update an existing recipe.
const updaterecipe = async (req,res)=>{
  try{
  let { name,
    description,
    pre_time,
    cook_time,
    category,
    cuisine,
    cooking_method,
    serving,
    difficulty,
    video,
    ingredient,
    cooking_step,
    nutrition,
    status } = req.body
    const image = req.file?.filename;
    let Status = (status === 'Publish') ? true : false;


    // Check if ingredient and nutrition are defined and are arrays
    const ingredients = req.body.ingredient.map(i => ({
      name: i.name,
      value: Number(i.value),
      unit: i.unit
    }));

    const nutritions = req.body.nutrition.map(i => ({
      name: i.name,
      value: Number(i.value),
      unit: i.unit
    }));

    const recipe = await recipemodel.findByIdAndUpdate(req.params.id, {
       name,
       image,
      description,
      pre_time,
      cook_time,
      category,
      cuisine,
      cooking_method,
      serving,
      difficulty,
      video,
      ingredient:ingredients,
      cooking_step,
      nutrition:nutritions,
      status:Status }, { new: true })
      if (!recipe) return res.status(404).json({ error: 'recipe not found' });
      return res.redirect('/admin/recipe')
  } catch (err) {
    res.status(400).json({ error: 'Failed to update recipe', details: err.message });
  }
};

// Controller to delete a recipe by ID.
const deleterecipe = async (req,res)=>{
  try {
      const { id } = req.params;
  
      const data = await recipemodel.findByIdAndDelete(id);
  
      if (!data) {
        return res.status(404).send('recipe not found');
      }
  
      return res.redirect('/admin/recipe');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
};


module.exports={allrecipe,addrecipe,createrecipe,editrecipe,updaterecipe,deleterecipe}