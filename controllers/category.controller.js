// Import  required model for category operations
const categorymodel = require("../models/category")
const slugify = require('slugify');

// Controller to fetch and display paginated categories with recipe counts.
const category = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    // Convert to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const category = categorymodel.aggregate([
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
    const result = await categorymodel.aggregatePaginate(category, options);

    // Render view with paginated data
    return res.render('admin/category', {
      category: result.docs,
      totalcategory: result.totalDocs,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });
  }
  catch (error) {
    console.log('error :' + error.message);
  }
};

// Controller to render the add category form.
const addcategory = async (req, res) => {
  return res.render('admin/addcategory')
};

// Controller to create a new category.
const createcategory = async (req, res) => {
  try {
    let { name, description, status } = req.body
    const image = req.file?.filename;
    let Status = (status === 'Publish') ? true : false;
    const slug = slugify(name, { lower: true, strict: true });
    let data = await categorymodel.create({ name, description, slug, image, status: Status })

    return res.redirect('/admin/category')
  } catch (err) {
    return res.send(err.message)
  }
};

// Controller to render the edit category form.
const editcategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await categorymodel.findById(id);
    if (!category) {
      return res.status(404).send("category  not found");
    }

    return res.render('admin/updatecategory', { category });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).send("Server error");
  }
};

// Controller to update an existing category.
const updatecategory = async (req, res) => {
  try {
    let { name, description, status } = req.body
    const image = req.file?.filename;
    let Status = (status === 'Publish') ? true : false;
    const updatedcategory = await categorymodel.findByIdAndUpdate(req.params.id, { name, description, image, status: Status }, { new: true })

    if (!updatedcategory) return res.status(404).json({ error: 'category not found' });

    return res.redirect('/admin/category')
  } catch (err) {
    res.status(400).json({ error: 'Failed to update category', details: err.message });
  }
};

// Controller to delete a category by ID.
const deletecategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await categorymodel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).send('cooking method not found');
    }
    return res.redirect('/admin/category');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = { category, addcategory, createcategory, editcategory, updatecategory, deletecategory }
