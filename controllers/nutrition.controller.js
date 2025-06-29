// Import the nutrition model for database operations
const nutritionmodel = require("../models/nutrition")

//  Controller to fetch and display paginated nutrition items with recipe counts.
const nutrition = async (req,res)=>{
  try {
    const { page = 1, limit = 5 } = req.query;

    // Convert to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const nutrition = nutritionmodel.aggregate([
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: 'category',
          as: 'recipes'
        }
      },
      {
        $addFields: {
          postLength: {
            $size: '$recipes'
          }
        }
      },

    ])

    // Pagination options
    const options = {
      page: pageNumber,
      limit: limitNumber
    }

    // Apply pagination on aggregation
    const result = await nutritionmodel.aggregatePaginate(nutrition, options);

    // Render view with paginated data
    return res.render('admin/nutrition', {
      nutrition: result.docs,
      totalnutrition: result.totalDocs,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });
  }
  catch (error) {
    console.log('error :' + error.message);
  }
};

// Controller to render the add nutrition form.
const addnutrition = (req, res) => {
  return res.render('admin/addnutrition')
};

// Controller to create a new nutrition item.
const createnutrition = async (req, res) => {
        try {
          // console.log(req.body)
          let { name,status } = req.body
          let Status = (status === 'Publish') ? true :false;
          let data = await nutritionmodel.create({ name,status :Status})
          // console.log(data)
      
          return res.redirect('/admin/nutrition')
        } catch (err) {
          return res.send(err.message)
        }
};

// Controller to render the edit nutrition form.
const editnutrition = async (req, res) => {
  try {
    const nutrition = await nutritionmodel.findById(req.params.id);
    if (!nutrition) {
      return res.status(404).send("Nutrition  not found");
    }

    return res.render('admin/updatenutrition', { nutrition });
  } catch (error) {
    console.error("Error fetching nutrition:", error);
    return res.status(500).send("Server error");
  }
};

// Controller to update an existing nutrition item.
const updatenutrition = async (req, res) => {
  try {
    const { name, status } = req.body;
    const Status = (status === 'Publish') ? true : false;

    if (!name) {
      return res.status(400).send('name is required');
    }

    const updatedData = await nutritionmodel.findByIdAndUpdate(
      req.params.id,
      { name, status: Status },
      { new: true } // <-- important to get updated data back
    );

    if (!updatedData) {
      return res.status(404).send('name not found');
    }

    // console.log(updatedData);
    return res.redirect('/admin/nutrition');

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Controller to delete a nutrition item by ID.
const deletenutrition = async(req,res)=>{
  try {
      const { id } = req.params;
  
      const data = await nutritionmodel.findByIdAndDelete(id);
  
      if (!data) {
        return res.status(404).send('nutrition name not found');
      }
  
      return res.redirect('/admin/nutrition');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
};

// Export all nutrition controllers for use in routes
module.exports= {nutrition,addnutrition,createnutrition,editnutrition,updatenutrition,deletenutrition}