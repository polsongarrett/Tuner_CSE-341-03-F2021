const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator');

const User = require("../models/user");

exports.getIndex = (req, res, next) => 
{
  res.render('index', {
      pageTitle: 'Search',
      path: '/',
      mus: [] //Placeholder to work with index.ejs
  });
};

exports.getLogin = (req, res, next) => 
{
  let message = req.flash('error'); // sets our message variable using our 'flash' package with the value of 'error'. 'message' is then used as the value of 'errorMessage' in our res.render below.
  if (message.length > 0) { // says if the message length is greater than 0 (which means we have a message)...
    message = message[0]; // set the message in element [0] of the array (the first position).
  } else { 
    message = null; // if message length is 0 then set message to null.
  }
    console.log("If you're logged into a session, then 'true'. If not, then 'undefined'.", req.session.isLoggedIn); // this shows in our console whether we are logged into a session or not.
  res.render('auth/login', {
      pageTitle: 'Login',
      path: '/views/auth/login',
      errorMessage: message,
      error: null,
      csrfToken: req.csrfToken()
  });
};

exports.login = (req, res, next) =>
{
  user.find({email:req.body.email, password: req.body.password}).then(result => {
    if (result.length > 1) {
      let error = ["login", "Some error occurred. There are too many people with this username and password"];
      res.render('auth/login', {
        pageTitle: 'Login',
        path: '/views/auth/login',
        error: error,
        csrfToken: req.csrfToken()
      });
      return;
    }
    else if (result.length == 1) {
      req.session.isLoggedIn = true;
      res.redirect("/");
      return;
    }
    else {
      let error = ["login", "Authentication failed"]
      res.render('auth/login', {
        pageTitle: 'Login',
        path: '/views/auth/login',
        error: error,
        csrfToken: req.csrfToken()
      })
    }
  }).catch(err => {
    next(new Error(err));
  })
}

// THE FOLLOWING IS STEPHEN'S SIGNUP CODE FOR getSignup and signup
// exports.getSignup = (req, res, next) => 
// {
//   res.render('auth/signup', {
//       pageTitle: 'Sign Up page',
//       path: '/views/auth/signup',
//       error:null,
//       csrfToken: req.csrfToken()
//   });
// };


// exports.signup = (req, res, next) => 
// {
//   //validate input
//   if (req.body.password != req.body.confirmPassword) {
//     let error = ["confirmPassword", "Password confirmation does not match"]
//     res.render('auth/signup', {
//       pageTitle: 'Sign Up page',
//       path: '/views/auth/signup',
//       error: error,
//       csrfToken: req.csrfToken()
//     })
//     return;
//   }


//   //hold user data
//   let userObj = {
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     password: req.body.password
//     imageUrl: "filler",
//     musician: {
//       first_name:"filler",
//       last_name:"filler",
//       location:{
//         city:req.body.city,
//         county:req.body.address,
//         longitude:0,
//         latitude:0,
//       }
//     },
//     lead_vocals:false,
//     backup_vocals:false,
//     genres:null,
//     instruments:null,
//   }

//   //create the user object
//   let insert = new user(userObj);

//   //save
//   insert.save().catch(err => {
//     next(new Error(err));
//   })

//   res.redirect("/");
// }

// This is our 'getSignup' function that renders our signup view.
exports.getSignup = (req, res, next) => {
  let message = req.flash('error'); // sets our message variable using our 'flash' package with the value of 'error'. 'message' is then used as the value of 'errorMessage' in our res.render below.
  if (message.length > 0) { // says if the message length is greater than 0 (which means we have a message)...
    message = message[0]; // set the message in element [0] of the array (the first position).
  } else { 
    message = null; // if message length is 0 then set message to null.
  }
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message,
      oldInput: { // this is used for making our user input sticky. For 'getSignup' we have the fields blank so they are not rendered on the page.
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      validationErrors: [] // we set an empty array to hold validation errors if they occur.
    });    
  };


// this stores a new user in our database.
exports.signup = (req, res, next) => {
  let message = req.flash('error'); // sets our message variable using our 'flash' package with the value of 'error'. 'message' is then used as the value of 'errorMessage' in our res.render below.
  if (message.length > 0) { // says if the message length is greater than 0 (which means we have a message)...
    message = message[0]; // set the message in element [0] of the array (the first position).
  } else { 
    message = null; // if message length is 0 then set message to null.
  }
  // these lines pull the data from our signup.ejs view. They match the fields in models/user.js in our User schema.
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req); // const errors collects any errors found in 'validationResult' that is a const at the top of this page.
  // next if statement says if errors is not (!) empty using the isEmpty() function to check, return the res with status 422 (means validation failed) and render a page.
    if (!errors.isEmpty()) {
      console.log("This is our errors array from 'postSignup'", errors.array()); // shows us what's in the errors.array()
      return res.status(422).render('auth/signup', { // status(422) sends the '422 Unprocessable Entity' code. Means it was unable to process the contained instructions.
          path: '/signup',
          pageTitle: 'Signup',
          errorMessage: errors.array()[0].msg, // looks at the errors.array() and pulls out the first object and from the pulls the 'msg' value. We could pull the 'param' value for more detail.
          oldInput: { // we use this to send the email and password constants and the confirmPassword data (pulled from the body request) back to the page to render due to an error. It makes it sticky.
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            confirmPassword: req.body.confirmPassword // we have to pull this one from the body because it's not defined as a const.
          },
          validationErrors: errors.array() // this returns the full array of errors and we can access them with our 'validationErrors' definition.
        });
    }
    // this is how we encrypt our password. It calls our 'bcrypt' const from earlier on this page.
    // it then uses the hash() function which accepts arguments. The first says to hash our 'password'.
    // The second is the SALT value. It specifies how many rounds of hashing to create a secure password.
    // Higher numbers take longer but they are more secure. 12 is generally accepted as highly secure.
    // It is an asynchronus request so it gives us back a prmoise so we return it and then create a block to get our hashed password.
    bcrypt
    .hash(password, 12) 
    // if there is no existing user we execute the following block to create a new user. It uses the 'User' Schema defined in models/user.js
    .then(hashedPassword => {
      const user = new User({ // calls our User schema from models/user.js
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      });
      return user.save(); // saves our data in the user const to the database.
    })
    .then(result => {
      req.flash('error', '<div class="user-message"><p>Successfully signed up! Please login:</p></div>'); // flashes the message using our flash method setup in app.js. First value 'error' is a key that matches what we used in the 'postSignup' in this block, the second value is the message that gets flashed.
      res.redirect('/login'); // we then redirect the user to the login page because after signing up they'll need to login.
    // REMOVED UNTIL MAIL IS IMPLEMENTED
      // // we redirect and then call our 'transporter' content to send a confirmation email using the following method.
      // return transporter.sendMail({ // we return this so that the code ends here when this is true.
      //   to: email, // sends to our email constant defined above.
      //   from: 'mvrush@hotmail.com',
      //   subject: 'Signup succeeded!',
      //   html: '<h1>You successfully signed up!</h1>'
      // });      
    })
    .catch(err => {
      console.log("err from our email 'sendMail' in controllers/auth.js", err)
      const error = new Error(err);
      error.httpStatusCode = 500; // we aren't using this line yet but it bascially sets the value for 'httpStatusCode' to 500.
      return next(error); // when we use next with error called as an argument, Express will skip all middlwares and move right to an error handling middleware (it's found in our app.js).
    });
};


exports.getProfile = (req, res, next) => 
{
  res.render('musician/profile', {
      pageTitle: 'Profile',
      path: '/views/musician/profile',
      // Obvious placeholder code...
      musician: {
        name: "Bill",
        imageUrl: "images/bill-and-guitar.jpg",
        instrument: "Guitar",
        address: "320 Elm St.",
        city: "Nashville"
      }
  });
};