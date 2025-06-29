// Import required modules and middleware
const express = require('express')
const router = express.Router()
const upload = require('../middlewares/multer')
const checkLogin = require('../middlewares/checkLogin')

// Import all controllers used in admin routes
const {adminlogin,dashboard} = require('../controllers/admin.controller')
const {allrecipe,addrecipe,createrecipe,editrecipe,updaterecipe,deleterecipe} = require('../controllers/recipe.controller')
const {category,addcategory,createcategory,editcategory,updatecategory,deletecategory} = require('../controllers/category.controller')
const {cuisine,addcuisine,createcuisine,editcuisine,updatecuisine,deletecuisine} = require('../controllers/cuisine.controller')
const {cooking,addcooking,createcooking,editcooking,updatecooking,deletecooking} = require('../controllers/cooking.controlller')
const {nutrition,addnutrition,createnutrition,editnutrition,updatenutrition,deletenutrition} = require('../controllers/nutrition.controller')
const {nutritionunit,addunit,creatunit,editunit,updateunit,deleteunit} = require('../controllers/nutrition.unit.controller')
const {country,addcountry,createcountry,editcountry,updatecountry,deletecountry} = require('../controllers/country.controller')
const {state,addstate,createstate,editstate,updatestate,deletestate} = require('../controllers/state.controller')
const {city,addcity,createcity,editcity,updatecity,deletecity} = require('../controllers/city.controller')
const {page,addpage,createpage,editpage,updatepage,deletepage} = require('../controllers/page.controller')
const {user,deleteuser,blockuser,unblockuser} = require("../controllers/user.controller")
const {comment,hidecomment,approvecomment,review,hidereview,approvereview} = require("../controllers/comment.review.controller")
const {contactus,deletecontact} = require("../controllers/contactuscontroller")
const {profile,updateprofile,updatepassword,bannersetting,updatebanner,homesetting,changeorder,saveHomeOrder,edithome,updatehomesetting,generalsetting,updategeneralsetting,socialsetting,updatesocial} = require('../controllers/setting.controller')

/**
 * =========================
 *        LOGIN routes
 * =========================
 */

// Render admin login page
router.get('/login',(req, res) => {res.render('admin/login')})
// Handle admin login POST
router.post('/login',adminlogin)
// Handle admin logout, clear token cookie
router.get('/logout',checkLogin, async (req,res)=>{
    res.clearCookie('token');
   return res.redirect('/admin/login')
})


/**
 * =========================
 *      DASHBOARD routes
 * =========================
 */

// Render admin dashboard
router.get('/dashboard',checkLogin,dashboard)


/**
 * =========================
 *      ALL RECIPES routes
 * =========================
 */

// Show all recipes (paginated)
router.get('/recipe',checkLogin,allrecipe)
// Render add recipe form
router.get('/addrecipe',checkLogin,addrecipe)
// Handle recipe creation (with image upload)
router.post('/recipe',checkLogin,upload.single('image'),createrecipe)
// Render edit recipe form
router.get('/updaterecipe/:id',checkLogin,editrecipe)
// Handle recipe update (with image upload)
router.post('/recipe/:id',checkLogin,upload.single('image'),updaterecipe)
// Delete a recipe
router.get('/deleterecipe/:id',checkLogin,deleterecipe)


/**
 * =========================
 *      CATEGORY routes
 * =========================
 */

// Show all categories (paginated)
router.get('/category',checkLogin,category)
// Render add category form
router.get('/addcategory',checkLogin,addcategory)
// Handle category creation (with image upload)
router.post('/category',checkLogin, upload.single('image'),createcategory)
// Render edit category form
router.get('/updatecategory/:id',checkLogin,editcategory)
// Handle category update (with image upload)
router.post('/category/:id',checkLogin,upload.single('image'),updatecategory)
// Delete a category
router.get('/deletecategory/:id',checkLogin,deletecategory)


/**
 * =========================
 *      CUISINES routes
 * =========================
 */

// Show all cuisines
router.get('/cuisine',checkLogin,cuisine)
// Render add cuisine form
router.get('/addcuisine',checkLogin,addcuisine)
// Handle cuisine creation
router.post('/cuisine',checkLogin,createcuisine)
// Render edit cuisine form
router.get('/updatecuisine/:id',checkLogin,editcuisine)
// Handle cuisine update
router.post('/cuisine/:id',checkLogin,updatecuisine)
// Delete a cuisine
router.get('/deletecuisine/:id',checkLogin,deletecuisine)


/**
 * =========================
 *      COOKING routes
 * =========================
 */

// Show all cooking methods
router.get('/cooking',checkLogin,cooking)
// Render add cooking method form
router.get('/addcooking',checkLogin,addcooking)
// Handle cooking method creation
router.post('/cooking',checkLogin,createcooking)
// Render edit cooking method form
router.get('/updatecooking/:id',checkLogin,editcooking)
// Handle cooking method update
router.post('/cooking/:id',checkLogin,updatecooking)
// Delete a cooking method
router.get('/deletecooking/:id',checkLogin,deletecooking)


/**
 * =========================
 *      NUTRITION routes
 * =========================
 */

// Show all nutrition items
router.get('/nutrition',checkLogin,nutrition)
// Render add nutrition form
router.get('/addnutrition',checkLogin,addnutrition)
// Handle nutrition creation
router.post('/nutrition',checkLogin,createnutrition)
// Render edit nutrition form
router.get('/updatenutrition/:id',checkLogin,editnutrition)
// Handle nutrition update
router.post('/nutrition/:id',checkLogin,updatenutrition)
// Delete a nutrition item
router.get('/deletenutrition/:id',checkLogin,deletenutrition)


/**
 * =========================
 *   NUTRITION UNIT routes
 * =========================
 */

// Show all nutrition units
router.get('/nutritionunit',checkLogin,nutritionunit)
// Render add nutrition unit form
router.get('/addunit',checkLogin,addunit)
// Handle nutrition unit creation
router.post('/nutritionunit',checkLogin,creatunit)
// Render edit nutrition unit form
router.get('/updateunit/:id',checkLogin,editunit)
// Handle nutrition unit update
router.post('/nutritionunit/:id',checkLogin,updateunit)
// Delete a nutrition unit
router.get('/deleteunit/:id',checkLogin,deleteunit)


/**
 * =========================
 *      COUNTRY routes
 * =========================
 */

// Show all countries
router.get('/country',checkLogin,country)
// Render add country form
router.get('/addcountry',checkLogin,addcountry)
// Handle country creation
router.post('/country',checkLogin,createcountry)
// Render edit country form
router.get('/updatecountry/:id',checkLogin,editcountry)
// Handle country update
router.post('/country/:id',checkLogin,updatecountry)
// Delete a country
router.get('/deletecountry/:id',checkLogin,deletecountry)


/**
 * =========================
 *      STATE routes
 * =========================
 */

// Show all states
router.get('/state',checkLogin,state)
// Render add state form
router.get('/addstate',checkLogin,addstate)
// Handle state creation
router.post('/state',checkLogin,createstate)
// Render edit state form
router.get('/updatestate/:id',checkLogin,editstate)
// Handle state update
router.post('/state/:id',checkLogin,updatestate)
// Delete a state
router.get('/deletestate/:id',checkLogin,deletestate)


/**
 * =========================
 *      CITY routes
 * =========================
 */

// Show all cities
router.get('/city',checkLogin,city)
// Render add city form
router.get('/addcity',checkLogin,addcity)
// Handle city creation
router.post('/city',checkLogin,createcity)
// Render edit city form
router.get('/updatecity/:id',checkLogin,editcity)
// Handle city update
router.post('/city/:id',checkLogin,updatecity)
// Delete a city
router.get('/deletecity/:id',checkLogin,deletecity)


/**
 * =========================
 *      PAGE routes
 * =========================
 */

// Show all pages
router.get('/page',checkLogin,page)
// Render add page form
router.get('/addpage',checkLogin,addpage)
// Handle page creation
router.post('/page',checkLogin,createpage)
// Render edit page form
router.get('/updatepage/:id',checkLogin,editpage)
// Handle page update
router.post('/page/:id',checkLogin,updatepage)
// Delete a page
router.get('/deletepage/:id',checkLogin,deletepage)


/**
 * =========================
 *      USERS routes
 * =========================
 */

// Show all users
router.get('/user',checkLogin,user)
// Delete a user
router.get('/deleteuser/:id',checkLogin,deleteuser)
// Block a user
router.get('/blockuser/:id',checkLogin,blockuser)
// Unblock a user
router.get('/unblockuser/:id',checkLogin,unblockuser)


/**
 * =========================
 *   COMMENT or REVIEW routes
 * =========================
 */

// Show all comments
router.get('/comments',checkLogin,comment)
// Hide a comment
router.get('/hidecomment/:id',checkLogin,hidecomment)
// Approve a comment
router.get('/approvecomment/:id',checkLogin,approvecomment)
// Show all reviews
router.get('/reviews',checkLogin,review)
// Hide a review
router.get('/hidereview/:id',checkLogin,hidereview)
// Approve a review
router.get('/approvereview/:id',checkLogin,approvereview)


/**
 * =========================
 *   CONTACT US routes
 * =========================
 */

// Show all contact us messages
router.get('/contact',checkLogin,contactus)
// Delete a contact us message
router.get('/deletecontact/:id',checkLogin,deletecontact)


/**
 * =========================
 *   PROFILE SETTING routes
 * =========================
 */

// Show profile settings
router.get('/profile',checkLogin,profile)
// Update profile info
router.post('/profile',checkLogin,updateprofile)
// Change admin password
router.post('/change-password',checkLogin,updatepassword)


/**
 * =========================
 *   BANNER SETTING routes
 * =========================
 */

// Show banner settings
router.get('/bannersetting',checkLogin,bannersetting)
// Update banner image
router.post('/bannersetting',checkLogin,upload.single('image'),updatebanner)


/**
 * =========================
 *   HOME SETTING routes
 * =========================
 */

// Show home settings
router.get('/homesetting',checkLogin,homesetting)
// Change home order
router.get('/changeorder',checkLogin,changeorder)
// Save home order
router.post('/homesetting',checkLogin,saveHomeOrder)
// Render edit home section form
router.get('/updatehome/:id',checkLogin,edithome)
// Update home section
router.post('/homesetting/:id',checkLogin,updatehomesetting)


/**
 * =========================
 *   GENERAL SETTING routes
 * =========================
 */

// Show general settings
router.get('/generalsetting',checkLogin,generalsetting)
// Update general settings (with image upload)
router.post('/generalsetting/:id',checkLogin,upload.single('image'),updategeneralsetting)


/**
 * =========================
 *   SOCIAL LINKS routes
 * =========================
 */

// Show social settings
router.get('/socialsetting',checkLogin,socialsetting)
// Update social settings
router.post('/socialsetting/:id',checkLogin,updatesocial)

// Export the router to be used in the main app
module.exports = router