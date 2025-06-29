const favouritemodel = require("../models/favourite")

const favcounts = async (req, res, next) => {
  try {
    if (req.session && req.session.user) {
      const count = await favouritemodel.countDocuments({ user: req.session.user });
      res.locals.favCount = count;
      res.locals.user = req.session.user;
    } else {
      res.locals.favCount = 0;
      res.locals.user = null;
    }
  } catch (err) {
    console.error('Error in favCount middleware:', err);
    res.locals.favCount = 0;
    res.locals.user = null;
  }
  next();
};

module.exports = favcounts;


