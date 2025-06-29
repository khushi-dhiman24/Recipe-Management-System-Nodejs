// Import required modules and middleware
const express = require('express')
const router = express.Router()
const upload = require('../middlewares/multer') // Multer for file uploads (not used here but imported)
const favcount = require("../middlewares/favcounts") // Middleware to count user favourites

// Import controllers for site routes
const {addfavourite,removefavourite} = require("../controllers/favourites.controller")
const {index,page,getconatct,contact,getsignup,signup,getlogin,login,logout,allrecipe,categoryPage,cuisinepage,singlepage,
    comment,review,search,getprofile,updateprofile,getchangepassword,changepassword,favourite} = require("../controllers/site.controller")

// =========================
// INDEX PAGE route
// =========================

// Render the main index page with favourite count
router.get('/index', favcount, index)


// =========================
// SIGNUP or LOGIN route
// =========================

// Render signup page
router.get('/signup', getsignup)
// Handle signup form submission
router.post('/signup', signup)
// Render login page with favourite count
router.get('/login', favcount, getlogin)
// Handle login form submission with favourite count
router.post('/login', favcount, login)
// Handle user logout
router.get('/logout', logout)


// =========================
// 404 PAGE or SEARCH route
// =========================

// Render custom 404 not found page
router.get('/notfoundpage', (req, res) => { res.render('site/notfoundpage') })
// Handle search requests with favourite count
router.get('/search', favcount, search)


// =========================
// CONTACT US routes
// =========================

// Render contact us page with favourite count
router.get('/contactus', favcount, getconatct)
// Handle contact form submission with favourite count
router.post('/contactus', favcount, contact)


// =========================
// ALL RECIPES / CATEGORY / CUISINE / SINGLE RECIPE routes
// =========================

// Show all recipes with favourite count
router.get('/allrecipe', favcount, allrecipe)
// Show recipes by category slug with favourite count
router.get('/category/:slug', favcount, categoryPage)
// Show recipes by cuisine slug with favourite count
router.get('/cuisine/:slug', favcount, cuisinepage)
// Show single recipe page by category and recipe slug with favourite count
router.get('/:categories/:recipe', favcount, singlepage)


// =========================
// MY PROFILE or CHANGE PASSWORD routes
// =========================

// Render user profile page with favourite count
router.get('/myprofile', favcount, getprofile)
// Handle profile update with favourite count
router.post('/updateprofile', favcount,upload.single('image'), updateprofile)
// Render change password page with favourite count
router.get('/changepassword', favcount, getchangepassword)
// Handle change password form submission with favourite count
router.post('/changepassword', favcount, changepassword)


// =========================
// MY FAVOURITE routes
// =========================

// Render user's favourite recipes page with favourite count
router.get('/favourite', favcount, favourite)
// Add a recipe to favourites by ID with favourite count
router.post('/favourite/add/:id', favcount, addfavourite)
// Remove a recipe from favourites by ID with favourite count
router.post('/favourite/remove/:id', favcount, removefavourite)


// =========================
// COMMENT or REVIEW routes
// =========================

// Add a comment to a recipe by ID with favourite count
router.post('/comment/:id', favcount, comment)
// Add a review to a recipe by ID with favourite count
router.post('/review/:id', favcount, review)

// =========================
// PAGE route
// =========================

// Render a dynamic page based on slug with favourite count
router.get('/:slug', favcount, page)


// Export the router to be used in the main app
module.exports = router