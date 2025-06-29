// Import the cooking model for database operations
const cookingmodel = require("../models/cooking")

// Controller to fetch and display paginated cooking methods with recipe counts.
const cooking = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    // Convert to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Aggregation with lookup and custom field
    const cooking = cookingmodel.aggregate([
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: 'cooking',
          as: 'recipes'
        }
      },
      {
        $addFields: {
          postLength: { $size: '$recipes' }
        }
      }
    ]);

    // Pagination options
    const options = {
      page: pageNumber,
      limit: limitNumber
    };

    // Apply pagination on aggregation
    const result = await cookingmodel.aggregatePaginate(cooking, options);

    // Render view with paginated data
    return res.render('admin/cooking', {
      cooking: result.docs,
      totalcooking: result.totalDocs,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });
  } catch (error) {
    console.log('Error:', error.message);
  }
};

// Controller to render the add cooking method form.
const addcooking = (req, res) => {
  return res.render('admin/addcooking')
};

// Controller to create a new cooking method.
const createcooking = async (req, res) => {
  try {
    //   console.log(req.body)
    let { name, status } = req.body
    let Status = (status === 'Publish') ? true : false;
    let data = await cookingmodel.create({ name, status: Status })
    //   console.log(data)

    return res.redirect('/admin/cooking')
  } catch (err) {
    return res.send(err.message)
  }
};

// Controller to render the edit cooking method form.
const editcooking = async (req, res) => {
  try {
    const id = req.params.id;
    const cooking = await cookingmodel.findById({ _id: id });
    if (!cooking) {
      return res.status(404).send("cooking method  not found");
    }

    return res.render('admin/updatecooking', { cooking });
  } catch (error) {
    console.error("Error fetching cooking method:", error);
    return res.status(500).send("Server error");
  }
};

// Controller to update an existing cooking method.
const updatecooking = async (req, res) => {
  try {
    const { name, status } = req.body;
    const Status = (status === 'Publish') ? true : false;

    if (!name) {
      return res.status(400).send('cooking method is required');
    }

    const updatedData = await cookingmodel.findByIdAndUpdate(
      req.params.id,
      { name, status: Status },
      { new: true } // <-- important to get updated data back
    );

    if (!updatedData) {
      return res.status(404).send('cooking method not found');
    }

    // console.log(updatedData);
    return res.redirect('/admin/cooking');

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Controller to delete a cooking method by ID.
const deletecooking = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await cookingmodel.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).send('cooking method not found');
    }

    return res.redirect('/admin/cooking');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

// Export all cooking controllers for use in routes
module.exports = { cooking, addcooking, createcooking, editcooking, updatecooking, deletecooking }