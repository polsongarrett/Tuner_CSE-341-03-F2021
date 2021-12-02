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

const Options = {
  useUnifiedTopology: true,
  useNewURLParser: true,
  family: 4
};


const csrfProtection = csrf();

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
app.use(express.static(path.join(__dirname, 'public')));
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

app.use(csrfProtection); 
app.use(flash()); // We are using flash for error messaging on the signup page etc.

app.use((req, res, next) => {
  // Used for user authentication. Can reuse later.
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// // Logic for verifying a user. (Temporarily removed by Matt R.)
// // The next middleware is super important. It sets up our 'user' from the session so that the user persists across requests.
// // That way in our controllers admin.js and shop.js files when we call req.user, it knows that we are using the req.user from here which holds the session user.
// app.use((req, res, next) => {
//   // throw new Error('Sync Dummy Error'); // used for error testing
//   if (!req.session.user) { // this gets the user out of the sessions and also says if no req.session.user then just go to the next middleware.
//     return next(); // we use 'return' so that the code following it will not be executed and next(); will send it to the next middleware.
//   }
//   User.findById(req.session.user._id) // we then find the 'user' by '_id' in the database and store the found user in the req object (req.user) a couple lines below.
//   .then(user => {
//     // throw new Error('ASync Dummy Error'); // used for error testing.
//     if (!user) { // in this if we're being extra careful to avoid errors (error handling) and check again, if there's no user object, go to the next middleware.
//       return next();
//     }
//     req.user = user; // we get back a mongoose model user which we store in req.user. This req.user is used in controllers admin.js and shop.js whenever req.user is called.
//     next(); // we call next so that the incoming requests can continue with the next middleware.
//   })
//   // this error won't fire if we don't find a user with the _id, but it will fire for technical issues like if the database is down or
//   // if the user of this app doesn't have sufficient permissions to execute this action.
//   // (I used to run this to find errors before applying advanced error handling with 'throw'.) .catch(err => console.log("err from 'findById' middleware defining req.session.user._id in app.js", err));
//   .catch(err => {
//     next(new Error(err)); // In asnynchrounous code we use next instead of throw so that this is detected by Express. So, inside of 'promise', 'then' or 'catch' blocks inside of callbacks you have to use 'next'.
//   });
// });


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

// app.get('/500', errorController.get500);
// app.use(errorController.get404);
// app.use((error, req, res, next) => {
//   res.redirect('/500');
// });


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
