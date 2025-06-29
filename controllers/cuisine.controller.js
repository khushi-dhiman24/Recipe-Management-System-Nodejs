// Import the cuisine model for database operations
const cuisinemodel = require("../models/cuisine")
// Import slugify to generate URL-friendly slugs from cuisine names
const slugify = require('slugify');

// Controller to fetch and display paginated cuisines with recipe counts.
const cuisine = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    // Convert to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const cuisine = cuisinemodel.aggregate([
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
    const result = await cuisinemodel.aggregatePaginate(cuisine, options);

    // Render view with paginated data
    return res.render('admin/cuisine', {
      cuisine: result.docs,
      totalcuisine: result.totalDocs,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });
  }
  catch (error) {
    console.log('error :' + error.message);
  }
};

// Controller to render the add cuisine form.
const addcuisine = (req, res) => {
  return res.render('admin/addcuisine')
};

// Controller to create a new cuisine.
const createcuisine = async (req, res) => {
  try {
    //   console.log(req.body)
    let { name, status } = req.body
    let Status = (status === 'Publish') ? true : false;
    const slug = slugify(name, { lower: true, strict: true });
    let data = await cuisinemodel.create({ name,slug, status: Status })
    //   console.log(data)

    return res.redirect('/admin/cuisine')
  } catch (err) {
    return res.send(err.message)
  }
};

// Controller to render the edit cuisine form.
const editcuisine = async (req, res) => {
  try {
    const id = req.params.id;
    const cuisine = await cuisinemodel.findById(id);
    if (!cuisine) {
      return res.status(404).send("cuisine name not found");
    }

    return res.render('admin/updatecuisine', { cuisine });
  } catch (error) {
    console.error("Error fetching cuisine name:", error);
    return res.status(500).send("Server error");
  }
/*******  d75b26d8-9ae0-4032-9b46-26167c1902b2  *******/
};

// Controller to update an existing cuisine.
const updatecuisine = async (req, res) => {
  try {
    const { name, status } = req.body;
    const Status = (status === 'Publish') ? true : false;

    if (!name) {
      return res.status(400).send('cooking method is required');
    }

    const updatedData = await cuisinemodel.findByIdAndUpdate(
      req.params.id,
      { name, status: Status },
      { new: true } // <-- important to get updated data back
    );

    if (!updatedData) {
      return res.status(404).send('cooking method not found');
    }

    // console.log(updatedData);
    return res.redirect('/admin/cuisine');

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Controller to delete a cuisine by ID.
const deletecuisine = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await cuisinemodel.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).send('cooking method not found');
    }

    return res.redirect('/admin/cuisine');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

// Export all cuisine controllers for use in routes
module.exports = { cuisine, addcuisine, createcuisine, editcuisine, updatecuisine, deletecuisine }