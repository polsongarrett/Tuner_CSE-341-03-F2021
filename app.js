const path = require('path'); // for getting project directory path
const http = require('http'); // imported for creating a server
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
// Not sure which of the following we need:
// const mongoose = require('mongoose');
// const MongoDBStore = require('connect-mongodb-session')(session); // TODO: Rename this variable?
// const flash = require('connect-flash'); 
const csrf = require('csurf');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

dotenv.config(); // needed for using .env files 
// TODO: Uncomment when we get the error pages uP
// const errorController = require('./controllers/error');
// const User = require('./models/user');

const app = express();

// TODO: set up database connection
// const MONGODB_URI = "mongodb+srv://user1:fFWr3lKfHj2NXlJF@cluster0.rcm5v.mongodb.net/shop";
// const store = new MongoDBStore({
//   uri: MONGODB_URI,
//   collection: 'sessions'
// });

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
      // store: store
    }
  )
);

app.use(csrfProtection); 
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
  res.locals.csrfToken = req.csrfToken();
  next();
});

// TODO: Create and use routes
//
app.use(searchRoutes);
app.use(adminRoutes);
app.use(tunerRoutes);
app.use(errorController.get404);
// app.use(shopRoutes);
// app.use(authRoutes);

// app.get('/500', errorController.get500);
// app.use(errorController.get404);
// app.use((error, req, res, next) => {
//   res.redirect('/500');
// });


// const MONGODB_URL = process.env.MONGODB_URL || MONGODB_URI;

app.listen(PORT);
console.log("Now listening on " + PORT);

// mongoose
//   .connect(MONGODB_URL)
//   .then(result => {
//     app.listen(port);
//   })
//   .catch(err => {
//     console.log(err);
//   });
