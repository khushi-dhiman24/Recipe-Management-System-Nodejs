// Import the state and country models for database operations
const statemodel = require('../models/state')
const countrymodel = require('../models/country')

// Controller to fetch and display paginated states with country info.
const state = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    // Convert to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const state = statemodel.aggregate([
      {
        $lookup: {
          from: 'countries',
          localField: 'country',
          foreignField: '_id',
          as: 'country'
        }
      },
      {
        $unwind: {
          path: '$country',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          name: 1,
          country: 1
        }
      }
    ])
    // Pagination options
    const options = {
      page: pageNumber,
      limit: limitNumber
    }

    // Apply pagination on aggregation
    const result = await statemodel.aggregatePaginate(state, options);

    // Render view with paginated data
    return res.render('admin/state', {
      state: result.docs,
      totalstate: result.totalDocs,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });
  }
  catch (error) {
    console.log('error :' + error.message);
  }
};

// Controller to render the add state form.
const addstate = async (req, res) => {
  const country = await countrymodel.find()
  return res.render('admin/addstate', { country })
};

// Controller to create a new state.
const createstate = async (req, res) => {
  try {
    // console.log(req.body)
    const { name, countryid } = req.body
    let data = await statemodel.create({ name, country: countryid })
    // console.log(data)

    return res.redirect('/admin/state')
  } catch (err) {
    return res.send(err.message)
  }
};

// Controller to render the edit state form.
const editstate = async (req, res) => {
  try {
    const country = await countrymodel.find();
    const state = await statemodel.findById(req.params.id)
    if (!state) {
      return res.status(404).send("state name not found");
    }

    return res.render('admin/updatestate', { state, country });
  } catch (error) {
    console.error("Error fetching state name:", error);
    return res.status(500).send("Server error");
  }
};

// Controller to update an existing state.
const updatestate = async (req, res) => {
  try {
    const { name, countryid } = req.body;

    if (!name) {
      return res.status(400).send('state name is required');
    }
    const updatedData = await statemodel.findByIdAndUpdate(
      req.params.id,
      { name, country: countryid },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).send('state name not found');
    }

    // console.log(updatedData);
    return res.redirect('/admin/state');

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Controller to delete a state by ID.
const deletestate = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await statemodel.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).send('state name not found');
    }

    return res.redirect('/admin/state');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

// Export all state controllers for use in routes
module.exports = { state, addstate, createstate, editstate, updatestate, deletestate }