// Import the country model for database operations
const countrymodel = require("../models/country")

// Controller to fetch and display paginated countries.
const country = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await countrymodel.paginate({}, options); 

    res.render('admin/country', {
      country: result.docs,
      totalcountry: result.totalDocs,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });

  } catch (error) {
    console.log('error :' + error.message);
  }
};

// Controller to render the add country form.
const addcountry = (req, res) => {
  return res.render('admin/addcountry')
};

// Controller to create a new country.
const createcountry = async (req, res) => {
  try {
    //   console.log(req.body)
    let { name} = req.body
    let data = await countrymodel.create({ name})
    //   console.log(data)

    return res.redirect('/admin/country')
  } catch (err) {
    return res.send(err.message)
  }
};

// Controller to render the edit country form.
const editcountry = async (req, res) => {
  try {
    const country = await countrymodel.findById(req.params.id);
    if (!country) {
      return res.status(404).send("country name not found");
    }

    return res.render('admin/updatecountry', { country });
  } catch (error) {
    console.error("Error fetching country name:", error);
    return res.status(500).send("Server error");
  }
};

// Controller to update an existing country.
const updatecountry = async (req, res) => {
  try {
    const { name} = req.body;

    if (!name) {
      return res.status(400).send('country name is required');
    }

    const updatedData = await countrymodel.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).send('country name not found');
    }

    // console.log(updatedData);
    return res.redirect('/admin/country');

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Controller to delete a country.
const deletecountry = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await countrymodel.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).send('country name not found');
    }

    return res.redirect('/admin/country');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

// // Export all country controllers for use in routes
module.exports ={country,addcountry,createcountry,editcountry,updatecountry,deletecountry}