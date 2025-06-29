// Import required model for city operations
const citymodel = require('../models/city')
const statemodel = require('../models/state')

// Controller to fetch and display paginated cities with their states.
const city = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    // Convert to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const city = citymodel.aggregate([
      {
        $lookup: {
          from: 'states',
          localField: 'state',
          foreignField: '_id',
          as: 'state'
        }
      },
      {
        $unwind: {
          path: '$state',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          name: 1,
          state: 1
        }
      }
    ])
    // Pagination options
    const options = {
      page: pageNumber,
      limit: limitNumber
    }

    // Apply pagination on aggregation
    const result = await citymodel.aggregatePaginate(city, options);

    // Render view with paginated data
    return res.render('admin/city', {
      city: result.docs,
      totalcity: result.totalDocs,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });
  }
  catch (error) {
    console.log('error :' + error.message);
  }
};

// Controller to render the add city form.
const addcity = async (req, res) => {
  const state = await statemodel.find()
  return res.render('admin/addcity', { state })
};

// Controller to create a new city.
const createcity = async (req, res) => {
  try {
    //   console.log(req.body)
    const { name, stateid } = req.body
    let data = await citymodel.create({ name, state: stateid })
    //   console.log(data)

    return res.redirect('/admin/city')
  } catch (err) {
    return res.send(err.message)
  }
};

// Controller to render the edit city form.
const editcity = async (req, res) => {
  try {
    const state = await statemodel.find();
    const city = await citymodel.findById(req.params.id)
    if (!city) {
      return res.status(404).send("city name not found");
    }

    return res.render('admin/updatecity', { city, state });
  } catch (error) {
    console.error("Error fetching city name:", error);
    return res.status(500).send("Server error");
  }
};

// Controller to update an existing city.
const updatecity = async (req, res) => {
  try {
    const { name, stateid } = req.body;

    if (!name) {
      return res.status(400).send('city name is required');
    }
    const updatedData = await citymodel.findByIdAndUpdate(
      req.params.id,
      { name, state: stateid },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).send('state or city name not found');
    }

    // console.log(updatedData);
    return res.redirect('/admin/city');

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Controller to delete a city by ID.
const deletecity = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await citymodel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).send('city name not found');
    }
    return res.redirect('/admin/city');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = { city, addcity, createcity, editcity, updatecity, deletecity }