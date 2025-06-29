// Import the contactus model for database operations
const contactusmodel = require("../models/contactus")

// Controller to fetch and display paginated contact messages.
const contactus = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };

    const contact = contactusmodel.aggregate([
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          message: 1
        }
      }
    ]);

    const result = await contactusmodel.aggregatePaginate(contact, options);

    return res.render('admin/contact', {
      contact: result.docs,
      totalDocs: result.totalDocs,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });

  } catch (error) {
    console.error("Error fetching contact messages:", error.message);
    res.status(500).send("Server Error");
  }
}

// Controller to delete a contact message by ID.
const deletecontact = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await contactusmodel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).send('cooking method not found');
    }
    return res.redirect('/admin/contact');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

// Export the contact us controllers for use in routes
module.exports ={contactus,deletecontact}