// Import all required models for site operations
const bannermodel = require("../models/bannersetting")
const generalmodel = require("../models/generalsetting")
const socialmodel = require("../models/socialsetting")
const categorymodel = require("../models/category")
const cuisinemodel = require("../models/cuisine")
const homemodel = require("../models/homesetting")
const recipemodel = require("../models/recipe")
const usermodel = require("../models/user")
const pagemodel = require("../models/page")
const citymodel = require("../models/city")
const statemodel = require("../models/state")
const countrymodel = require("../models/country")
const contactusmodel = require("../models/contactus")
const favouritemodel = require("../models/favourite")
const commentmodel = require("../models/comment")
const reviewmodel = require("../models/review")
const bcrypt = require('bcryptjs')

// Controller to render the site index (home) page.
const index = async (req, res) => {
    try {
        const recipe = await recipemodel.find({})
        const home = await homemodel.find({ status: true })
        const category = await categorymodel.find({})
        const cuisine = await cuisinemodel.find({})
        const general = await generalmodel.find({})
        const social = await socialmodel.find({})
        const banner = await bannermodel.find({ status: true })
        const user = req.session.user;

        return res.render('site/index', { user, recipe, home, category, cuisine, banner, general, social });
    } catch (err) {
        console.error('Error fetching banner:', err);
        return res.status(500).send('Something went wrong');
    }
};

// Controller to render a static page by slug.
const page = async (req, res) => {
    try {
        const recipe = await recipemodel.find({})
        const home = await homemodel.find({ status: true })
        const category = await categorymodel.find({})
        const cuisine = await cuisinemodel.find({})
        const general = await generalmodel.find({})
        const social = await socialmodel.find({})
        const banner = await bannermodel.find({ status: true })
         const slug = req.params.slug;
        const page = await pagemodel.findOne({  slug, status: true });
        if (!page) return res.status(404).send("Page not found");       

        return res.render('site/page', {  recipe,page, home, category, cuisine, banner, general, social });
    } catch (err) {
        console.error('Error fetching:', err);
        return res.status(500).send('Something went wrong');
    }
};

// Controller to render the contact us page.
const getconatct = async (req, res) => {
    try {
        const page = await pagemodel.find({ status: true })
        const recipe = await recipemodel.find({})
        const home = await homemodel.find({ status: true })
        const category = await categorymodel.find({})
        const cuisine = await cuisinemodel.find({})
        const general = await generalmodel.find({})
        const social = await socialmodel.find({})
        const banner = await bannermodel.find({ status: true })
        return res.render('site/contactus', { page, recipe, home, 
            category, cuisine, banner, general, social });
    } catch (err) {
        console.error('Error fetching:', err);
        // return res.status(500).send('Something went wrong');
    }
};

// Controller to handle contact form submission.
const contact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            return res.status(400).send('All fields are required.');
        }

        // Save to DB
        const contact = new contactusmodel({ name, email, phone, message });
        await contact.save();

        return res.redirect('/contactus'); // Redirect with query param or flash message
    } catch (err) {
        console.error('Error saving contact form:', err.message);
        return res.status(500).send('Server Error');
    }
};

// Controller to render the signup page.
const getsignup = async (req, res) => {
    try {
        const category = await categorymodel.find({})
        const cuisine = await cuisinemodel.find({})
        const general = await generalmodel.find({})
        const social = await socialmodel.find({})
        return res.render('site/signup', { category, cuisine, general, social })
    }
    catch (err) {
        console.error('Error fetching:', err);
        return res.status(500).send('Something went wrong');
    }
};

// Controller to handle user signup.
const signup = async (req, res) => {
    try {
        const { username, phone, email, password } = req.body;
        if (!username || !phone || !email || !password) {
            return res.status(400).send("All fields are required");
        }
        const existingUser = await usermodel.findOne({ email });
        if (existingUser) {
            return res.status(409).send("User already exists with this email");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10))

        // Save user
        const user = new usermodel({
            username,
            phone,
            email,
            password: hashedPassword
        });
        await user.save();

        return res.redirect('/index'); // or send success message
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

// Controller to render the login page.
const getlogin = async (req, res) => {
    try {
        const user = await usermodel.find({})
        const category = await categorymodel.find({})
        const cuisine = await cuisinemodel.find({})
        const general = await generalmodel.find({})
        const social = await socialmodel.find({})
        return res.render('site/login', { user, category, cuisine, general, social })
    }
    catch (err) {
        console.error('Error fetching:', err);
        return res.status(500).send('Something went wrong');
    }
};

// Controller to handle user login.
const login = async (req, res) => {
    try {
        const category = await categorymodel.find({})
        const cuisine = await cuisinemodel.find({})
        const general = await generalmodel.find({})
        const social = await socialmodel.find({})
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render('site/login', { category, cuisine, general, social, error: 'Please provide username and password' });
        }
        let user = await usermodel.findOne({ email });
        if (!user) {
            return res.render('site/login', { category, cuisine, general, social, error: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.redirect('/login')
        }
        req.session.user = user;
        return res.redirect('/index')
    } catch (error) {
        console.error('userlogin :' + error);
    }
};

// Controller to handle user logout.
const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout Error:', err);
            return res.status(500).send("Error logging out.");
        }
        res.clearCookie('connect.sid');
        return res.redirect('/index');
    });
};

// Controller to render all recipes page.
const allrecipe = async (req, res) => {
    try {
        const allrecipe = await recipemodel.find({})
        const home = await homemodel.find({ status: true })
        const category = await categorymodel.find({})
        const cuisine = await cuisinemodel.find({})
        const general = await generalmodel.find({})
        const social = await socialmodel.find({})
        const banner = await bannermodel.find({ status: true })
        return res.render('site/allrecipe', { allrecipe, home, category, cuisine, banner, general, social });
    } catch (err) {
        console.error('Error fetching :', err);
        return res.status(500).send('Something went wrong');
    }
};

// Controller to render a category page by slug.
const categoryPage = async (req, res) => {
    try {
        const category = await categorymodel.find({})
        const home = await homemodel.find({ status: true })
        const cuisine = await cuisinemodel.find({})
        const general = await generalmodel.find({})
        const social = await socialmodel.find({})
        const banner = await bannermodel.find({ status: true })
        const slug = req.params.slug;

        const categories = await categorymodel.findOne({ slug });

        if (!categories) {
            return res.render('site/notfoundpage', { message: 'Category not found' });
        }

        // Get recipes that have this category
        const allRecipe = await recipemodel.find({ category: categories._id, status: 1 }).sort({ _id: -1 });

        return res.render('site/category', {
            category, categories,
            allRecipe, home, cuisine, banner, general, social
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
};

// Controller to render a cuisine page by slug.
const cuisinepage = async (req, res) => {
    try {
        const category = await categorymodel.find({})
        const home = await homemodel.find({ status: true })
        const cuisine = await cuisinemodel.find({})
        const general = await generalmodel.find({})
        const social = await socialmodel.find({})
        const banner = await bannermodel.find({ status: true })
        const slug = req.params.slug;

        const cuisines = await cuisinemodel.findOne({ slug });
        if (!cuisines) {
            return res.status(404).render('site/notfoundpage', { message: 'cuisine not found' });
        }

        // Get recipes that have this cuisine
        const allRecipe = await recipemodel.find({ cuisine: cuisines._id, status: 1 }).sort({ _id: -1 });

        for (let recipe of allRecipe) {
            const matchedCategory = category.find(cat => cat._id.toString() === recipe.category.toString());
            recipe.categories = matchedCategory || { slug: 'uncategorized', name: 'Uncategorized' };
        }

        return res.render('site/cuisine', {
            category, cuisines,
            allRecipe, home, cuisine, banner, general, social
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
};

// Controller to render a single recipe page by category and recipe slug.
const singlepage = async (req, res) => {
    try {
        const category = await categorymodel.find({});
        const home = await homemodel.find({ status: true });
        const cuisine = await cuisinemodel.find({});
        const general = await generalmodel.find({});
        const social = await socialmodel.find({});
        const banner = await bannermodel.find({ status: true });

        const { categories, recipe } = req.params;

        // Step 1: Find category from slug
        const matchedCategory = await categorymodel.findOne({ slug: categories });

        if (!matchedCategory) {
            return res.status(404).render('site/notfoundpage', { message: 'Category not found' });
        }
        // Aggregation to fetch recipe with all related info
        const recipes = await recipemodel.aggregate([
            { $match: { slug: recipe } },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $lookup: {
                    from: 'cuisines',
                    localField: 'cuisine',
                    foreignField: '_id',
                    as: 'cuisine'
                }
            },
            {
                $lookup: {
                    from: 'cookings',
                    localField: 'cooking_method',
                    foreignField: '_id',
                    as: 'cooking_method'
                }
            },
            {
                $unwind: {
                    path: "$nutrition",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "nutritions",
                    localField: "nutrition.name",
                    foreignField: "_id",
                    as: "nutritionName"
                }
            },
            {
                $lookup: {
                    from: "nutritionunits",
                    localField: "nutrition.unit",
                    foreignField: "_id",
                    as: "nutritionUnit"
                }
            },
            {
                $unwind: {
                    path: "$nutrition",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$nutritionUnit",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: { path: '$category', preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: '$cuisine', preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: '$cooking_method', preserveNullAndEmptyArrays: true }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    image: { $first: "$image" },
                    cook_time: { $first: "$cook_time" },
                    pre_time: { $first: "$pre_time" },
                    cuisine: { $first: "$cuisine" },
                    description: { $first: "$description" },
                    category: { $first: "$category" },
                    cooking_method: { $first: "$cooking_method" },
                    serving: { $first: "$serving" },
                    difficulty: { $first: "$difficulty" },
                    ingredient: { $first: "$ingredient" },
                    video: { $first: "$video" },
                    cooking_step: { $first: "$cooking_step" },
                    nutrition: {
                        $push: {
                            name: "$nutritionName.name",
                            value: "$nutrition.value",
                            unit: "$nutritionUnit.unit"
                        }
                    }
                }
            }
        ]);
        // Helper to get YouTube embed URL
        function getEmbedUrl(youtubeUrl) {
            if (!youtubeUrl) return '';
            try {
                const urlObj = new URL(youtubeUrl);
                let videoId = '';

                if (urlObj.searchParams.has('v')) {
                    videoId = urlObj.searchParams.get('v');
                } else if (urlObj.hostname === 'youtu.be') {
                    videoId = urlObj.pathname.slice(1);
                }

                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}`;
                }
                return youtubeUrl;
            } catch (error) {
                return youtubeUrl;
            }
        }
            if (!recipes || recipes.length === 0) {
            return res.status(404).render('site/notfoundpage', { message: 'Recipe not found' });
        }

        let video = getEmbedUrl(recipes[0].video);

        // Fetch comments and build nested comment tree
        const comments = await commentmodel.find({ recipe: recipes[0]._id, status: true })
            .populate('user')
            .sort({ createdAt: 1 })
            .lean();

        function buildCommentTree(comments, parentId = null) {
            return comments
                .filter(c => {
                    if (!c.parentId && !parentId) return true;
                    return String(c.parentId) === String(parentId);
                }).map(c => ({
                    ...c,
                    replies: buildCommentTree(comments, c._id)
                }));
        }
        const nestedComments = buildCommentTree(comments);

        // Fetch reviews and calculate average rating
        const reviews = await reviewmodel.find({ recipe: recipes[0]._id, status: true })
            .populate('user')

        let avgRating = 0;
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            avgRating = totalRating / reviews.length;
        }

        // Fetch user's favourite recipes if logged in
        let favouriteRecipes = [];
        const userId = req.session.user;
        if (userId) {
            const favourites = await favouritemodel.find({ user: userId });
            favouriteRecipes = favourites.map(fav => fav.recipe.toString());
        }

        if (!recipes) {
            return res.status(404).render('site/notfoundpage', { message: 'Recipe not found' });
        }
        const recentRecipes = await recipemodel
            .find({})
            .sort({ createdAt: -1 })
            .limit(5)

        return res.render('site/singlepage', {
            category,
            recipes: recipes[0],
            recentRecipes,
            home,
            cuisine,
            banner,
            general,
            social,
            video,
            isLoggedIn: !!req.session.user,
            comments: nestedComments,
            reviews,
            avgRating,
            favouriteRecipes
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
};

// Controller to handle posting a comment on a recipe.
const comment = async (req, res) => {
    try {
        const { comment, recipeId, parentId } = req.body;
        if (!comment || !recipeId) {
            return res.status(400).send('Invalid data');
        }

        const recipeid = req.params.id;
        const recipes = await recipemodel.findById(recipeid).populate('category');
        if (!recipes) {
            return res.status(404).send('Recipe not found');
        }


        const newComment = new commentmodel({
            recipe: recipeId,
            user: req.session.user._id,
            comment,
            parentId: parentId || null,
            createdAt: new Date()
        });

        await newComment.save();

        return res.redirect(`/${recipes.category.slug}/${recipes.slug}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Controller to handle posting a review on a recipe.
const review = async (req, res) => {
    try {
        const { recipe_id, user_id, comment, rating } = req.body;

        if (!rating) {
            return res.status(400).send('Rating is required');
        }

        const recipe = await recipemodel.findById(recipe_id).populate('category');
        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }

        const newReview = new reviewmodel({
            recipe: recipe_id,
            user: user_id,
            comment,
            rating
        });

        await newReview.save();

        return res.redirect(`/${recipe.category.slug}/${recipe.slug}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Controller to handle recipe search.
const search = async (req, res) => {
    try {
        const recipe = await recipemodel.find({})
        const home = await homemodel.find({ status: true })
        const category = await categorymodel.find({})
        const cuisine = await cuisinemodel.find({})
        const general = await generalmodel.find({})
        const social = await socialmodel.find({})
        const banner = await bannermodel.find({ status: true })
        const keyword = req.query.search || '';

        const allRecipe = await recipemodel.find({
            name: { $regex: keyword, $options: 'i' },
            status: 1
        });

        return res.render('site/search', { allRecipe, keyword, recipe, home, category, cuisine, banner, general, social });

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
};

// Controller to render the user's profile page.
const getprofile = async (req, res) => {
    try {
        const category = await categorymodel.find({});
        const cuisine = await cuisinemodel.find({});
        const general = await generalmodel.find({});
        const social = await socialmodel.find({});
        const cityList = await citymodel.find({});
        const stateList = await statemodel.find({});
        const countryList = await countrymodel.find({});

        if (!req.session.user) {
            return res.redirect('/');
        }

        const user = await usermodel.findById(req.session.user);

        // Manually get name values
        const [cityObj, stateObj, countryObj] = await Promise.all([
            citymodel.findById(user.city),
            statemodel.findById(user.state),
            countrymodel.findById(user.country)
        ]);

        res.render('site/myprofile', {
            city: cityList,
            state: stateList,
            country: countryList,
            user,
            category,
            cuisine,
            general,
            social,
            cityName: cityObj ? cityObj.name : '',
            stateName: stateObj ? stateObj.name : '',
            countryName: countryObj ? countryObj.name : ''
        });

    } catch (err) {
        console.error('Error fetching:', err);
        return res.status(500).send('Something went wrong');
    }
};

// Controller to update the user's profile.
const updateprofile = async (req, res) => {
    try {
        const { name, email, phone, country, state, city, address } = req.body;
        const user = req.session.user;
        const image = req.file?.filename;

        if (!user) {
            return res.status(401).send('Unauthorized: User not logged in');
        }

        await usermodel.findByIdAndUpdate(user, {
            image:req.file?.filename,
            name,
            email,
            phone,
            country,
            state,
            city,
            address
        });



        await usermodel.findByIdAndUpdate(user);

        return res.redirect('/myprofile');
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).send('Internal Server Error');
    }
};

// Controller to render the change password page.
const getchangepassword = async (req, res) => {
    try {
        const category = await categorymodel.find({})
        const home = await homemodel.find({ status: true })
        const cuisine = await cuisinemodel.find({})
        const general = await generalmodel.find({})
        const social = await socialmodel.find({})
        const banner = await bannermodel.find({ status: true })
        return res.render('site/changepassword', { category, cuisine, general, social, home, banner })
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
};

// Controller to handle password change for the user.
const changepassword = async (req, res) => {
    const { password, new_pass, new_confirm } = req.body;
    console.log(req.body)
    // console.log(req.body);
    if (!password || !new_pass || !new_confirm) {
        return res.status(400).send('All fields are required');
    }

    try {
        const user = await usermodel.findOne();
        if (!user) return res.status(404).send('user not found');
        console.log(user)

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Current password is incorrect');
        console.log(isMatch)

        if (new_pass !== new_confirm) return res.status(400).send('New passwords do not match');

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(new_pass, salt);

        await user.save();
        return res.redirect('/myprofile');
    } catch (error) {
        console.error("Error updating password:", error.message);
        res.status(500).send('Error updating password');
    }
};

// Controller to render the user's favourite recipes page.
const favourite = async (req, res) => {
  try {
    const userId = req.session.user;
    if (!userId) return res.redirect('/login');

    const page = await pagemodel.find({ status: true });
    const home = await homemodel.find({ status: true });
    const category = await categorymodel.find({});
    const cuisine = await cuisinemodel.find({});
    const general = await generalmodel.find({});
    const social = await socialmodel.find({});
    const banner = await bannermodel.find({ status: true });

    const favourites = await favouritemodel.find({ user: userId }).populate('recipe');
   const favouriteRecipes = favourites.map(fav => fav.recipe);

  const recipesWithCategory = favouriteRecipes
  .filter(recipe => recipe) // skip nulls
  .map(recipe => {
    const matchedCategory = category.find(cat => cat._id.toString() === recipe.category?.toString());
    return {
      ...recipe.toObject(),
      categories: matchedCategory || { slug: 'uncategorized', name: 'Uncategorized' },
    };
  });


    return res.render('site/favourite', {
      page,
      favouriteRecipes: recipesWithCategory,
      home,
      category,
      cuisine,
      banner,
      general,
      social,
    });
  } catch (error) {
    console.error('Error loading favourites page:', error);
    return res.status(500).send('Something went wrong');
  }
};


// Export all site controllers for use in routes
module.exports = { index, page, getconatct, contact, getsignup, signup, getlogin, login, logout, allrecipe,
categoryPage, cuisinepage, singlepage, comment, review, search, getprofile, getchangepassword, 
changepassword, updateprofile, favourite};
