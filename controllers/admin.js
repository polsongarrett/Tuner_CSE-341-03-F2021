/********* This is the Admin Controller  **************/

const mongoose = require('mongoose'); // we require the mongoose package to enable our error handling arguments for database related errors (not totally sure on that. Has something to do with enabling 'throw new Error()' ).

const fileHelper = require('../util/file'); // calls our helper file from our util folder which aids in deleting files.

const { validationResult } = require('express-validator'); // brings in 'express-validator' and puts it n the 'validationResult' function.

// we import the class from the models folder, the musician.js file. We use a capital starting character for classes, hence 'Product'.
const Musician = require('../models/musician');
const User = require('../models/user')


// this next functions exports 'getAddMusician' to our routes/admin.js file
exports.getAddProfile = (req, res, next) => {
    // res.render tells router.get to render our 'edit-product.ejs' page. Then it gives it a JavaScript object filled with keynames that have data assigned to them.
    res.render('admin/edit-profile', {
        pageTitle: 'Add Profile',
        path: '/admin/add-profile', // this is the path the user types in the browser address
        editing: false, // this sets the editing parameter to 'false' which means you will not be in 'editMode' as defined in getEditProduct so the 'Add Product' button is then displayed.
        hasError: false,
        errorMessage: null,
        validationErrors: [] // we start with an empty array when we 'get' the AddProduct page.
    });
};

// this next functions exports 'postAddProduct' to our routes/admin.js file
exports.postAddProfile = (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const image = req.file;
    const leadVocals = req.body.leadVocals;
    const backupVocals = req.body.backupVocals;
    const city = req.body.city;
    const state = req.body.state;
    const country = req.body.country;
    const genre = req.body.genre;
    const instrument = req.body.instrument;
    
    if (!image) {
      return res.status(422).render('admin/edit-profile', { // status(422) sends the '422 Unprocessable Entity' code. Means it was unable to process the contained instructions.
        pageTitle: 'Add Profile',
        path: '/admin/edit-profile',
        editing: false, // we set this to false because we are not editing and don't want to change anything.
        hasError: true,
        musician: {
          firstName: firstName,
          lastName: lastName,
          leadVocals: leadVocals,
          backupVocals: backupVocals,
          city: city,
          state: state,
          country: country,
          genre: genre,
          instrument: instrument,
          leadVocals: leadVocals,
          backupVocals: backupVocals
        },
        errorMessage: 'Attached file is not an image.', // gets the first element out of an array built from 'errors' which hods data from 'validationResult(req).
        validationErrors: [] // gets the entire errors.array()
      });
    }
    
    const errors = validationResult(req); // sends a request to 'validationResult' defined above holding our 'express-validation'. Looks for validation errors.
    
    if (!errors.isEmpty()) { // says look at 'error' which holds 'validationResult(req)', if isEmpty() is not (!) empty, then run this block.
      console.log("This is our 'postAddMusician errors array:", errors.array());
      return res.status(422).render('admin/edit-profile', { // status(422) sends the '422 Unprocessable Entity' code. Means it was unable to process the contained instructions.
        pageTitle: 'Add Profile',
        path: '/admin/edit-profile',
        editing: false, // we set this to false because we are not editing and don't want to change anything.
        hasError: true,
        musician: {
          firstName: firstName,
          lastName: lastName,
          leadVocals: leadVocals,
          backupVocals: backupVocals,
          city: city,
          state: state,
          country: country,
          genre: genre,
          instrument: instrument,
          leadVocals: leadVocals,
          backupVocals: backupVocals
        },
        errorMessage: errors.array()[0].msg, // gets the first element out of an array built from 'errors' which hods data from 'validationResult(req).
        validationErrors: errors.array() // gets the entire errors.array()
      });
    }
    const imageUrl = image.path.replace('public', ''); // this finds that path to our images folder on our system and replaces the word 'public' with a blank '' so our imageUrl works with the database.
    // next lines create a new 'musician' constant from the Musician class with the musician info in it. This is based on our Mongoose schema values.
    // the 'firstName:' is the key to our schema, and 'firstName' is our value from the 'const title' above.
    const musician = new Musician({
      firstName: firstName,
      lastName: lastName,
      imageUrl: imageUrl,
      leadVocals: leadVocals,
      backupVocals: backupVocals,
      location: {
        city: city,
        state: state,
        country: country
        },
      genres: [genre],
      instruments: [instrument],
      userId: req.user // in mongoose it will look at the req.user and pull the _id from it automatically (req.user is defined in our app.js)
    });
    musician.save().then(result => { // the .save() is called from Mongoose we don't define it. Mongoose also gives us the .then() method. It's not technically a promise anymore.
      // console.log(result);
      console.log('From controllers/admin.js postAddProfile. It say...CREATED PROFILE!');
    //  res.redirect('/admin/products');  // our old code
      res.redirect('/profile');
    })
    .catch(err => {
      console.log("err from postAddProfile in controllers/admin.js", err);
      const error = new Error(err);
      error.httpStatusCode = 500; // we aren't using this line yet but it bascially sets the value for 'httpStatusCode' to 500.
      return next(error); // when we use next with error called as an argument, Express will skip all middlwares and move right to an error handling middleware (it's found in our app.js).
    });
};


exports.postEditProfile = (req, res, next) => 
{
  console.log("Edit Profile Success");
  // TODO: replace placholder data with req.body.xyz
  const userId = "619d67db1e540854b9a69072";
  const updatedUsername = "BillyBob";
  const updatedImageUrl = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.rollingstone.com%2Fmusic%2Fmusic-country%2Fbilly-bob-thornton-on-media-lies-musical-truths-and-new-boxmasters-album-106199%2F&psig=AOvVaw1yr6c2gyu1xP2w2Pooue2B&ust=1637728508210000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCNDfuaPUrfQCFQAAAAAdAAAAABAJ";
  const updatedEmail = "bb123xyz@gmail.com";
  const updatedPassword = "123xyz";
  const updatedFirstName = "Billy";
  const updatedLastName = "Bob";
  const updatedCity = "Montgomery";
  const updatedCountry = "USA";
  const updatedLongitude = "";
  const updatedLatitude = "";
  const updatedLead_vocals = false;
  const updatedBackup_vocals = false;
  const updatedGenres = [{"genreName":"Country"}, {"genreName":"R&B"}, {"genreName":"Rock"}];
  const updatedInstruments = [{"instrumentName":"Guitar"}, {"instrumentName":"Banjo"}, {"instrumentName":"Piano"}];

  User.findByIdAndUpdate(userId, 
    {
      username : updatedUsername,
      imageUrl : updatedImageUrl,
      email : updatedEmail,
      password : updatedPassword,
      musician: {
        firstName : updatedFirstName,
        lastName : updatedLastName,
        location : {
          city : updatedCity,
          country : updatedCountry,
          longitude : updatedLongitude,
          latitude : updatedLatitude
        },
        lead_vocals : updatedLead_vocals,
        backup_vocals : updatedBackup_vocals,
        genres : updatedGenres,
        instruments : updatedInstruments
      }
    }
  )
    .then(result => {
      // console.log(result);
      res.redirect("/profile");
    })
    .catch(err => {
      console.log(err);
    });
};