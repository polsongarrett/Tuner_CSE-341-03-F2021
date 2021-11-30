const path = require('path'); // for getting project directory path
const http = require('http'); // imported for creating a server
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoDBTuner = require('connect-mongodb-session')(session);
// const flash = require('connect-flash'); 
// const csrf = require('csurf');
const dotenv = require('dotenv');

dotenv.config(); // needed for using .env files 

// const PORT = process.env.PORT || 3000;
const PORT = 3000;

// TODO: Uncomment when we get the error pages up
// const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

// TODO: set up database connection
const MONGODB_URI = "mongodb+srv://Admin:4Dmin21@cluster0.pjfz1.mongodb.net/Tuner";
const tuner = new MongoDBTuner({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const Options = {
  useUnifiedTopology: true,
  useNewURLParser: true,
  family: 4
};


// const csrfProtection = csrf();

app.set('view engine', 'ejs'); // change based on engine: pug, hbs, ejs
app.set('views', 'views');     // default where to find templates

// TODO: set up routes
// Registered routes
const errorController = require('./controllers/error');
const userRoutes = require('./routes/user')
const tunerRoutes = require('./routes/tuner');
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
      tuner: tuner
    }
  )
);

// app.use(csrfProtection); 
// app.use(flash()); Not sure if we need flash

// Logic for verifying a user. Can be used later 
//
// app.use((req, res, next) => {
//   if (!req.session.user) {
//     return next();
//   }
//   User.findById(req.session.user._id)
//   .then(user => {
//     if (!user) {
//       return next();
//     }
//     req.user = user; // Mongoose model user object
//     next();
//   })
//   .catch(err => {
//     throw new Error(err);
//   });
// });

app.use((req, res, next) => {
  // Used for user authentication. Can reuse later.
  // res.locals.isAuthenticated = req.session.isLoggedIn; 
  // res.locals.csrfToken = req.csrfToken();
  next();
});

// TODO: Create and use routes
//
app.use(userRoutes);
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
