const user = require("../models/user");

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
  res.render('auth/login', {
      pageTitle: 'Login',
      path: '/views/auth/login',
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

exports.getSignup = (req, res, next) => 
{
  res.render('auth/signup', {
      pageTitle: 'Sign Up page',
      path: '/views/auth/signup',
      error:null,
      csrfToken: req.csrfToken()
  });
};

exports.signup = (req, res, next) => 
{
  //validate input
  if (req.body.password != req.body.confirmPassword) {
    let error = ["confirmPassword", "Password confirmation does not match"]
    res.render('auth/signup', {
      pageTitle: 'Sign Up page',
      path: '/views/auth/signup',
      error: error,
      csrfToken: req.csrfToken()
    })
    return;
  }

  //hold user data
  let userObj = {
    username: req.body.name,
    email: req.body.email,
    password: req.body.password,
    imageUrl: "filler",
    musician: {
      first_name:"filler",
      last_name:"filler",
      location:{
        city:req.body.city,
        county:req.body.address,
        longitude:0,
        latitude:0,
      }
    },
    lead_vocals:false,
    backup_vocals:false,
    genres:null,
    instruments:null,
  }

  //create the user object
  let insert = new user(userObj);

  //save
  insert.save().catch(err => {
    next(new Error(err));
  })

  res.redirect("/");
}


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