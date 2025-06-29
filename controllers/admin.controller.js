// Import all required models for admin operations
const profilemodel = require('../models/profile'); 
const recipemodel = require("../models/recipe")    
const usermodel = require("../models/user")        
const categorymodel = require("../models/category")
const cuisinemodel = require("../models/cuisine")   
const commentmodel = require("../models/comment") 
const reviewmodel = require("../models/review")     
const bcrypt = require('bcryptjs');               
const { setUser } = require('../service/auth');

//  Admin login controller. 
const adminlogin = async (req, res) => {
    try {
        const { adminusername, password } = req.body;
        const user = await profilemodel.findOne({ adminusername });
        if (!user) {
            return res.render('admin/login', { error: 'User not found!' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            const token = setUser({ adminusername: user.adminusername });
            res.cookie('token', token);
            return res.redirect('/admin/dashboard');
        } else {
            return res.redirect('/admin/login');
        }
    } catch (error) {
        console.error('adminLogin :' + error);
    }
};

// Admin dashboard controller.
const dashboard = async (req, res) => {
  try {
    const recipeCount = await recipemodel.countDocuments();
    const categoryCount = await categorymodel.countDocuments();
    const cuisineCount = await cuisinemodel.countDocuments();
    const userCount = await usermodel.countDocuments();

    const latestComments = await commentmodel.find()
      .populate('user')
      .populate('recipe')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const latestReviews = await reviewmodel.find()
      .populate('user')
      .populate('recipe')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return res.render('admin/dashboard', {
      recipeCount,
      categoryCount,
      cuisineCount,
      userCount,
      latestComments,
      latestReviews
    });

  } catch (error) {
    console.error('Error loading dashboard:', error);
    return res.status(500).send('Server Error');
  }
};

// Export the admin controllers for use in routes
module.exports = { adminlogin, dashboard };