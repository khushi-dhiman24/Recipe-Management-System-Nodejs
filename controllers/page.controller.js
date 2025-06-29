// Import the page model for database operations
const pagemodel = require("../models/page")
// Import slugify to generate URL-friendly slugs from page titles
const slugify = require('slugify');

// Controller to fetch and display paginated pages.
const page = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await pagemodel.paginate({}, options);

    return res.render('admin/page', {
      pages: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit
    });

  } catch (error) {
    console.log('error :' + error.message);
  }
};

// Controller to render the add page form.
const addpage = (req, res) => {
  return res.render('admin/addpage')
};

// Controller to create a new page.
const createpage = async (req, res) => {
        try {
        //   console.log(req.body)
          let { title,description,status} = req.body
          let Status = (status === 'Publish') ? true :false;
          const slug = slugify(title, { lower: true, strict: true });
          let data = await pagemodel.create({ title,description,status:Status,slug})
        //   console.log(data)
          return res.redirect('/admin/page')
        } catch (err) {
          return res.send(err.message)
        }
};

// Controller to render the edit page form.
const editpage = async (req, res) => {
  try {
    const page = await pagemodel.findById(req.params.id);
    if (!page) {
      return res.status(404).send("page  not found");
    }
    return res.render('admin/updatepage', { page });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).send("Server error");
  }
};

// Controller to update an existing page.
const updatepage = async(req,res)=>{
    try {
      let { title,description,status } = req.body;
      console.log( req.body)
      let Status = (status === 'Publish') ? true : false;
      const updatedpage = await pagemodel.findByIdAndUpdate(req.params.id, {  title,description,status: Status }, { new: true })
  
      if (!updatedpage) return res.status(404).json({ error: 'page not found' });
       console.log(updatedpage);
  
      return res.redirect('/admin/page')
    } catch (err) {
      res.status(400).json({ error: 'Failed to update page', details: err.message });
    }
}

// Controller to delete a page by ID.
const deletepage = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pagemodel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).send('page not found');
    }
    return res.redirect('/admin/page');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

// Export all page controllers for use in routes
module.exports = {page,addpage,createpage,editpage,updatepage,deletepage}