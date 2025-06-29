// Import the user model for database operations
const usermodel = require("../models/user")

// Controller to fetch and display paginated users with city, state, and country info.
const user = async(req,res)=>{
  try {
    const { page = 1, limit = 5 } = req.query;

    // Convert to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const user = usermodel.aggregate([
       {
        $lookup: {
          from: 'cities',
          localField: 'city',
          foreignField: '_id',
          as: 'city'
        }
      },
      {
        $unwind: {
          path: '$city',
          preserveNullAndEmptyArrays: true
        }
      },
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
    ])
    // Pagination options
    const options = {
      page: pageNumber,
      limit: limitNumber
    }

    // Apply pagination on aggregation
    const result = await usermodel.aggregatePaginate(user, options);

    // Render view with paginated data
    return res.render('admin/user', {
      user: result.docs,
      totaluser: result.totalDocs,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });
  }
  catch (error) {
    console.log('error :' + error.message);
  }
}

// Controller to block a user by ID.
const blockuser = async(req,res)=>{
try {
    const userId = req.params.id;

    const updatedUser = await usermodel.findByIdAndUpdate(
      userId,
      { $set: { isBlocked: true } },
      { new: true } // returns updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

     return res.redirect('/admin/user');
  } catch (error) {
   console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}

// Controller to unblock a user by ID.
const unblockuser = async(req,res)=>{
try {
    const userId = req.params.id;

    const updatedUser = await usermodel.findByIdAndUpdate(
      userId,
      { $set: { isBlocked: false } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

   return res.redirect('/admin/user');
  } catch (error) {
   console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}

// Controller to delete a user by ID.
const deleteuser= async(req,res)=>{
  try {
    const { id } = req.params;

    const data = await usermodel.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).send('user not found');
    }

    return res.redirect('/admin/user');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}

// Export all user controllers for use in routes
module.exports ={user,deleteuser,blockuser,unblockuser}