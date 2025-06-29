// Import required modules
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo'); 
const app = express()
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser')
const adminRoutes = require("./routes/admin.routes")
const siteRoutes = require("./routes/site.routes")

// Configure session middleware with MongoDB store
app.use(session({
    secret: 'your_secret_key',  
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb://127.0.0.1:27017/recipe-management',
      collectionName: 'sessions',
      ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,  // 14 days
      httpOnly: true,
      secure: false  // true if using HTTPS
    }
  }))

// Middleware to make user session available in all EJS views
  app.use((req, res, next) => {
  res.locals.user = req.session.user || null;  // Make user available in all EJS views
  next();
});

// Middleware to parse cookies
app.use(cookie())

// Express built-in body parsers (redundant with bodyparser above)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Serve static files from 'public', 'uploads', and 'images' directories
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'))
app.use('/images', express.static('images'))

// Set EJS as the view engine and configure views directory
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('views', 'views')

// Register route handlers
app.use('/admin', adminRoutes) // Admin routes
app.use('/', siteRoutes)// Public site routes


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/recipe-management',)
.then(() => console.log('Connected! to MongoDB'));
// Start the server on port 3000
app.listen(3000, () => {
  try {
    console.log('Server is running on port 3000')
  } catch (error) {
    console.log('Server crash')
  }
});