// Import all required models for settings operations
const profilemodel = require("../models/profile")
const bannermodel = require("../models/bannersetting")
const generalmodel = require("../models/generalsetting")
const socialmodel = require("../models/socialsetting")
const homemodel = require('../models/homesetting')
const bcrypt = require('bcryptjs')


/**
 * =========================
 *      BANNER SETTINGS
 * =========================
 */

// Controller to render the banner settings page.
const bannersetting = async (req, res) => {
  const banner = await bannermodel.findOne(); // assuming one banner only
  return res.render('admin/bannersetting', { banner });
};

// Controller to update the banner settings.
const updatebanner = async (req,res)=>{
  try {
    const { title, sub_title, status } = req.body;
    const image = req.file?.filename;
    let Status = (status === 'Publish') ? true : false;
    
    let updateData = { title, sub_title,image,status:Status  };
    // console.log(updateData)

    let banner = await bannermodel.findOne();
    if (banner) {
      await bannermodel.updateOne({}, updateData);
    } else {
      banner = new bannermodel(updateData);
      await banner.save();
    }

    return res.redirect('/admin/bannersetting');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating banner');
  }
};

/**
 * =========================
 *      HOME SETTINGS
 * =========================
 */

// Controller to render the home settings page.
const homesetting = async (req, res) => {
  const homes = await homemodel.find(); // assuming one banner only
  return res.render('admin/homesetting', { homes });
};

// Controller to render the change order page for home sections.
const changeorder = async (req, res) => {
  const sections = await homemodel.find().sort({ order: 1 }); 
  return res.render('admin/changeorder',{sections})
};

// Controller to save the new order of home sections.
const saveHomeOrder = async(req,res)=>{
   try {
    const order = JSON.parse(req.body.order); // this is an array of section IDs

    for (let i = 0; i < order.length; i++) {
      await homemodel.findByIdAndUpdate(order[i], { order: i + 1 });
    }

    return res.redirect('/admin/homesetting');
  } catch (err) {
    console.error("Error updating section order:", err);
    return res.status(500).json({ error: 'Failed to update order', details: err.message });
  }
}

// Controller to render the edit home section form.
const edithome = async (req, res) => {
  try {
    const home = await homemodel.findById(req.params.id);
    if (!home) {
      return res.status(404).send("home setting  not found");
    }

    return res.render('admin/updatehome', { home });
  } catch (error) {
    console.error("Error fetching home setting:", error);
    return res.status(500).send("Server error");
  }
};

// Controller to update a home section.
const updatehomesetting = async(req,res)=>{
    try {
      const { section_name,heading,sub_heading,total_item,status } = req.body;
      const Status = (status === 'Publish') ? true : false;
  
      const updatedData = await homemodel.findByIdAndUpdate(
        req.params.id,
        {  section_name,heading,sub_heading,total_item,status: Status },
        { new: true } // <-- important to get updated data back
      );
  
      if (!updatedData) {
        return res.status(404).send('home setting not found');
      }
  
      return res.redirect('/admin/homesetting');
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
}


/**
 * =========================
 *    GENERAL SETTINGS
 * =========================
 */

//  Controller to render the general settings page.
const generalsetting = async (req, res) => {
  const general = await generalmodel.findOne(); // assuming one banner only
  // console.log(general)
  return res.render('admin/generalsetting', { general });
};

// Controller to update the general settings.
const updategeneralsetting = async (req, res) => {
  try {
    const {
      com_name,
      com_email,
      address,
      description,
      phone,
      copyright
    } = req.body;

    // console.log(req.body)

    const id = req.params.id;
    const general = await generalmodel.findById(id);

    if (!general) {
      return res.status(404).send('General setting not found');
    }

    // Only update image if a new one is uploaded
    const updatedData = {
      com_name,
      com_email,
      address,
      description,
      phone,
      copyright,
      image: req.file ? req.file.filename : general.image, // use old image if not updated
    };
    // console.log(updatedData)

    const updated = await generalmodel.findByIdAndUpdate(id, updatedData, { new: true });

    // console.log('Updated:', updated);

    return res.redirect('/admin/generalsetting');
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).send('Error updating general settings');
  }
};

/**
 * =========================
 *    PROFILE SETTINGS
 * =========================
 */
// Controller to render the admin profile page.
const profile = async (req, res) => {
  try {
    const profile = await profilemodel.findOne();
    return res.render('admin/profile', { profile }); // 'profile' is the EJS file
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).send('Server Error');
  }
};

// Controller to update the admin profile.
const updateprofile = async (req, res) => {
  const { adminname,adminemail, adminusername } = req.body;
  // console.log(req.body)

  if (!adminname || !adminemail || !adminusername) {
    return res.status(400).send('All fields are required');
  }

  try {
    const profile = await profilemodel.findOne();
    if (!profile) return res.status(404).send('Admin profile not found');

    profile.adminname = adminname;
    profile.adminemail= adminemail;
    profile.adminusername = adminusername;

    await profile.save();
    return res.redirect('/admin/profile');
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).send('Error updating profile');
  }
}

// Controller to update the admin password.
const updatepassword = async(req,res)=>{
  const { password, new_password, new_confirm } = req.body;
  // console.log(req.body);
  if (!password || !new_password || !new_confirm) {
    return res.status(400).send('All fields are required');
  }

  try {
    const profile = await profilemodel.findOne();
    if (!profile) return res.status(404).send('Admin profile not found');

    const isMatch = await bcrypt.compare(password, profile.password);
    if (!isMatch) return res.status(400).send('Current password is incorrect');

    if (new_password !== new_confirm) return res.status(400).send('New passwords do not match');

    const salt = await bcrypt.genSalt(10);
    profile.password = await bcrypt.hash(new_password, salt);

    await profile.save();
    return res.redirect('/admin/profile');
  } catch (error) {
    console.error("Error updating password:", error.message);
    res.status(500).send('Error updating password');
  }
};

/**
 * =========================
 *   SOCIAL LINKS SETTINGS
 * =========================
 */
// Controller to render the social links settings page.
const socialsetting = async (req, res) => {
  const social = await socialmodel.findOne(); // assuming one banner only
  // console.log(social)
  return res.render('admin/socialsetting', { social });
};

// Controller to update the social links.
const updatesocial= async (req, res) => {
  try{
  const { facebook, twitter, instagram,youtube } = req.body;

  const id = req.params.id;
  const social = await socialmodel.findById(id);

  if (!social) {
    return res.status(404).send('social setting not found');
  }
  const updated =await socialmodel.findByIdAndUpdate(id, { facebook, twitter, instagram,youtube }, { upsert: true });
  return res.redirect('/admin/socialsetting');
  }catch(error){
    console.error("Error fetching social:", error.message);
    res.status(500).send('Server Error');
  }
};

// Export all settings controllers for use in routes
module.exports ={profile,updateprofile,updatepassword,bannersetting,updatebanner,homesetting,changeorder,
  saveHomeOrder,edithome,updatehomesetting,generalsetting,updategeneralsetting,socialsetting,updatesocial}