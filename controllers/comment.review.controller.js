// Import comment and review models for database operations
const commentmodel = require("../models/comment")
const reviewmodel = require("../models/review")

// Controller to fetch and display paginated comments with user and recipe info.
const comment = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const aggregation = commentmodel.aggregate([
      {
        $lookup: {
          from: "recipes", 
          localField: "recipe",
          foreignField: "_id",
          as: "recipe"
        }
      },
      { $unwind: "$recipe" },
      {
        $lookup: {
          from: "users", 
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }, 
      {
        $project: {
          comment: 1,
          "user.username": 1,
          "recipe.name": 1,
          parent: 1,
          createdAt: 1,
          approved: 1,
          status: 1
        }
      }
    ]);

    const options = {
      page: pageNumber,
      limit: limitNumber
    };

    const result = await commentmodel.aggregatePaginate(aggregation, options);

    return res.render('admin/comments', {
      comment: result.docs,
      totalcomment: result.totalDocs,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });

  } catch (error) {
    console.log('Error: ' + error.message);
    res.status(500).send('Server Error');
  }
};

// Controller to hide a comment (set status to false).
const hidecomment = async (req, res) => {
try {
    const updatedcomment = await commentmodel.findByIdAndUpdate(
      req.params.id,
      { $set: { status: false } },
      { new: true } // returns updated document
    );

    if (!updatedcomment) {
      return res.status(404).json({ message: 'comment not found' });
    }

     return res.redirect('/admin/comments');
  } catch (error) {
   console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}

// Controller to approve a comment (set status to true).
const approvecomment = async (req, res) => {
try {
    const updatedcomment = await commentmodel.findByIdAndUpdate(
       req.params.id,
      { $set: { status: true } },
      { new: true }
    );

    if (!updatedcomment) {
      return res.status(404).json({ message: 'comment not found' });
    }

   return res.redirect('/admin/comments');
  } catch (error) {
   console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}

// Controller to fetch and display paginated reviews with user and recipe info.
const review = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    // Convert to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const review = reviewmodel.aggregate([
            {
        $lookup: {
          from: "recipes", 
          localField: "recipe",
          foreignField: "_id",
          as: "recipe"
        }
      },
      { $unwind: "$recipe" },
      {
        $lookup: {
          from: "users", 
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }, 
      {
        $project: {
          comment:1,
          rating:1,
          "user.username": 1,
          "recipe.name": 1,
          parent: 1,
          date:1,
          approved:1,
          status:1
        }
      }
    ])
    // Pagination options
    const options = {
      page: pageNumber,
      limit: limitNumber
    }

    // Apply pagination on aggregation
    const result = await reviewmodel.aggregatePaginate(review, options);
    // Render view with paginated data
    return res.render('admin/reviews', {
      review: result.docs,
      totalreview: result.totalDocs,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    });
  }
  catch (error) {
    console.log('error :' + error.message);
  }
};

// Controller to hide a review (set status to false).
const hidereview = async (req, res) => {
try {
    const updatedreview = await reviewmodel.findByIdAndUpdate(
      req.params.id,
      { $set: { status: false } },
      { new: true } // returns updated document
    );

    if (!updatedreview) {
      return res.status(404).json({ message: 'review not found' });
    }

     return res.redirect('/admin/comments');
  } catch (error) {
   console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}

//  Controller to approve a review (set status to true).
const approvereview = async (req, res) => {
try {
    const updatedreview = await reviewmodel.findByIdAndUpdate(
       req.params.id,
      { $set: { status: true } },
      { new: true }
    );

    if (!updatedreview) {
      return res.status(404).json({ message: 'review not found' });
    }

   return res.redirect('/admin/comments');
  } catch (error) {
   console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}

// Export all comment and review controllers for use in routes
module.exports={comment,hidecomment,approvecomment,review,hidereview,approvereview}