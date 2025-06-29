// Import the nutrition unit model for database operations
const nutritionunitmodel = require("../models/nutritionunit")

// Controller to fetch and display paginated nutrition units with recipe counts.
const nutritionunit = async (req,res)=>{
  try {
    const { page = 1, limit = 5 } = req.query;

    // Convert to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const nutritionunit = nutritionunitmodel.aggregate([
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
    const result = await nutritionunitmodel.aggregatePaginate(nutritionunit, options);

    // Render view with paginated data
    return res.render('admin/nutritionunit', {
      nutritionunit: result.docs,
      totalnutritionunit: result.totalDocs,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });
  }
  catch (error) {
    console.log('error :' + error.message);
  }
};

// Controller to render the add nutrition unit form.
const addunit = (req, res) => {
        return res.render('admin/addunit')
};

// Controller to create a new nutrition unit.
const creatunit = async (req, res) => {
        try {
          // console.log(req.body)
          let { unit,status } = req.body
          let Status = (status === 'Publish') ? true :false;
          let data = await nutritionunitmodel.create({ unit,status :Status})
          // console.log(data)
      
          return res.redirect('/admin/nutritionunit')
        } catch (err) {
          return res.send(err.message)
        }
};

// Controller to render the edit nutrition unit form.
const editunit = async (req, res) => {
  try {
    const nutritionunit = await nutritionunitmodel.findById(req.params.id);

    if (!nutritionunit) {
      return res.status(404).send("Nutrition unit not found");
    }

    return res.render('admin/updateunit', { nutritionunit });
  } catch (error) {
    console.error("Error fetching nutrition unit:", error);
    return res.status(500).send("Server error");
  }
};

// Controller to update an existing nutrition unit.
const updateunit = async (req, res) => {
  try {
    const { unit, status } = req.body;
    const Status = (status === 'Publish') ? true : false;

    if (!unit) {
      return res.status(400).send('Unit is required');
    }

    const updatedData = await nutritionunitmodel.findByIdAndUpdate(
      req.params.id,
      { unit, status: Status },
      { new: true } // <-- important to get updated data back
    );

    if (!updatedData) {
      return res.status(404).send('Unit not found');
    }

    // console.log(updatedData);
    return res.redirect('/admin/nutritionunit');

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Controller to delete a nutrition unit by ID.
const deleteunit = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await nutritionunitmodel.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).send('Unit not found');
    }

    return res.redirect('/admin/nutritionunit');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

// Export all nutrition unit controllers for use in routes
module.exports= {nutritionunit,addunit,creatunit,editunit,updateunit,deleteunit}