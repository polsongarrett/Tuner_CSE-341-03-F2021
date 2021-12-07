const path = require('path'); // for getting project directory path
const http = require('http'); // imported for creating a server
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
// Not sure which of the following we need:
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session); // TODO: Rename this variable?
const flash = require('connect-flash'); 
const csrf = require('csurf');
const dotenv = require('dotenv');
const multer = require('multer'); // brings in 'multer' which pulls binary data out of mulitipart/form data enabling file uploads. Installed with 'npm install --save multer'.
const User = require('./models/user'); // brings in our User class from the models/user.js

dotenv.config(); 

const PORT = process.env.PORT || 5000;

// needed for using .env files 
// TODO: Uncomment when we get the error pages uP
// const errorController = require('./controllers/error');
// const User = require('./models/user');

const app = express();

// TODO: set up database connection
const MONGODB_URI = "mongodb+srv://Admin:4Dmin21@cluster0.pjfz1.mongodb.net/Tuner";
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

const Options = {
  useUnifiedTopology: true,
  useNewURLParser: true,
  family: 4
};



// the 'fileStorage' const works with Multer which manages file uploads and storing.
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images'); // this is our path to the 'images' folder
  },
  filename: (req, file, cb) => {
  // used this to troubleshoot the date colon issue.  let date = new Date().toISOString().replace(/:/g,'_');
  // used to troubleshoot the date variable above.  console.log(date);
    // NOTE!! ON THE FOLLOWING LINE 'new Date().toISOString()' will put a colon (:) in the filename which Windows does not allow. That is why we add 'replace(/:/g,'_')' which replaces all colons (:) with an underscore.
    cb(null, new Date().toISOString().replace(/:/g,'_') + '-' + file.originalname); // we have it name the file with the current date as a string and concatenate (+) that to the original filename. The date gives it uniqueness in the case of duplicate files.
  }
});

// the 'fileFilter' filters what types of files we will accept.
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/gif'
    ) {
    cb(null, true); // true to store the file types in the 'if' part of the block
  } else {
    cb(null, false); // false if we don't want to store the file which is the else block
  }  
};

app.set('view engine', 'ejs'); // change based on engine: pug, hbs, ejs
app.set('views', 'views');     // default where to find templates

// TODO: set up routes
// Registered routes
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin')
const tunerRoutes = require('./routes/tuner');
const searchRoutes = require('./routes/search');
// const shopRoutes = require('./routes/shop');
// const authRoutes = require('./routes/auth');

const corsOptions = {
  origin: "https://<your_app_name>.herokuapp.com/",
  optionsSuccessStatus: 200
};

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')); // we use multer as a function () and we tell it the value for 'storage' is 'fileStorage' which is defined above. We then have it look for a 'single' file not multiple. That field is named 'image' which we specify in our 'edit-profile.ejs' view.

// The following line allows us to serve static files from our 'public' folder. It's called 'static' and it ships with express. It ultimately gives the 'public' folder read only access.
// we basically call 'static' from 'express' then we use 'path.join' to show a path to our 'public' folder. '__dirname' is the root folder of our project and then it finds the 'public' folder in there.
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images'))); // Line says "If we have a request that starts with '/images' THEN serve it using the 'static' method." We use the 'static' method as described in the notes above to make our 'images' folder a public folder that people can read-only access.

app.use(
  session(
    {
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    }
  )
);

app.use(csrfProtection); // We now add our Cross-Site Request Forgery (csrf) protection. Must be enabled after the session is set
app.use(flash()); // We are using flash for error messaging on the signup page etc.

app.use((req, res, next) => {
  // Used for user authentication. Can reuse later.
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Logic for verifying a user. (Temporarily removed by Matt R.)
// The next middleware is super important. It sets up our 'user' from the session so that the user persists across requests.
// That way in our controllers admin.js and shop.js files when we call req.user, it knows that we are using the req.user from here which holds the session user.
app.use((req, res, next) => {
  // throw new Error('Sync Dummy Error'); // used for error testing
  if (!req.session.user) { // this gets the user out of the sessions and also says if no req.session.user then just go to the next middleware.
    return next(); // we use 'return' so that the code following it will not be executed and next(); will send it to the next middleware.
  }
  User.findById(req.session.user._id) // we then find the 'user' by '_id' in the database and store the found user in the req object (req.user) a couple lines below.
  .then(user => {
    // throw new Error('ASync Dummy Error'); // used for error testing.
    if (!user) { // in this if we're being extra careful to avoid errors (error handling) and check again, if there's no user object, go to the next middleware.
      return next();
    }
    req.user = user; // we get back a mongoose model user which we store in req.user. This req.user is used in controllers admin.js and shop.js whenever req.user is called.
    next(); // we call next so that the incoming requests can continue with the next middleware.
  })
  // this error won't fire if we don't find a user with the _id, but it will fire for technical issues like if the database is down or
  // if the user of this app doesn't have sufficient permissions to execute this action.
  // (I used to run this to find errors before applying advanced error handling with 'throw'.) .catch(err => console.log("err from 'findById' middleware defining req.session.user._id in app.js", err));
  .catch(err => {
    next(new Error(err)); // In asnynchrounous code we use next instead of throw so that this is detected by Express. So, inside of 'promise', 'then' or 'catch' blocks inside of callbacks you have to use 'next'.
  });
});


// TODO: Create and use routes
//
// again, order matters. So list 'searchRoutes' second because it is calling our '/' page and that '/' exists in all addresses.
// We list 'tunerRoutes' third because if there is no leading filter (like we use '/admin' in adminRoutes), every request will go into our searchRoutes
// and anything not found in searchRoutes will go to tunerRoutes.
app.use('/admin', adminRoutes); // uses the 'adminRoutes' constant as an object, not a function, to use our admin.js file in the routes folder. I added '/admin' to this statement so that it will attach /admin to the path of the pages in admin.js, this is how we filter routes.
app.use(searchRoutes);
app.use(tunerRoutes);
app.use(errorController.get404);
// app.use(shopRoutes);
// app.use(authRoutes);

// the following line is used when we have a bigger error like our database is down or we have some other server error. It's called from places in our code where we need to show an error occured.
app.get('/500', errorController.get500); // calls the 'get500' function from our 'errorController'.

// The following line handles everything that our code and routes aren't programmed to do. It's kind of like a catch-all line. We use 'app.use' to handle all http methods, not just GET or POST.
// We can use '/' in this line but that's the default anyway so we don't need to use it.
app.use(errorController.get404);

// the next is a special middleware for errors and has the 'error' argument. It's our Error Handling Middleware.
// it gets moved to right away when you call 'next' with an 'error' passed to it like this 'next(error)'
// in our code when you see 'next(error)' this is the middleware it comes to.
app.use((error, req, res, next) => {
  // when it gets to this middlware it throws the 500 page instead of the detailed error data I log in the console.
  // res.redirect('/500'); // We don't want to redirect or we'll have in infinite loop if the error is in a syncrhonous block. Use the following lines.
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
  console.log("app.js caught this error from somewhere else! ->", error); // we console log the 'error' argument from app.use for troubleshooting.
});


const MONGODB_URL = process.env.MONGODB_KEY || MONGODB_URI;

// app.listen(PORT);
// console.log("Now listening on " + PORT);

mongoose
  .connect(MONGODB_URL, Options)
  .then(result => {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));

  })
  .catch(err => {
    console.log(err);
  });
