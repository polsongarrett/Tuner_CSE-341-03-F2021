const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const {
	validationResult
} = require('express-validator');

const User = require("../models/user");
const Musicians = require("../models/musician");

const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key: process.env.MAIL_API_KEY
		}
	})
);


exports.getIndex = (req, res, next) => {
	res.render('index', {
		pageTitle: 'Search',
		path: '/',
		mus: [] //Placeholder to work with index.ejs
	});
};

exports.getLogin = (req, res, next) => {
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
		oldInput: { // this is used for making our user input sticky. For 'getLogin' we have the fields blank so they are not rendered on the page.
			email: '',
			password: ''
		},
		validationErrors: [] // we set an empty array to hold validation errors if they occur.
	});
};

// this is our 'postLogin' function. It get's our login fields from our 'login.ejs. view and sets a header for our cookie.
exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	const errors = validationResult(req); // this gathers all the errors collected by this package.
	// next if statement says if errors is not (!) empty using the isEmpty() function to check, return the res with status 422 (means validation failed) and render login page.
	if (!errors.isEmpty()) {
		console.log("This is our errors array from 'postLogin'", errors.array()); // shows us what's in the errors.array()
		return res.status(422).render('auth/login', { // we return this so the code starting at User.findOne does not execute. // status(422) sends the '422 Unprocessable Entity' code. Means it was unable to process the contained instructions.
			path: '/login',
			pageTitle: 'Login',
			errorMessage: errors.array()[0].msg, // we pull the first item in the array and pull the 'msg' property from it to display our message
			oldInput: { // this is used for making our user input sticky. For 'postLogin' we have the JS Object filled with the constants defined in 'postLogin'.
				email: email,
				password: password
			},
			validationErrors: errors.array() // this returns the full array of errors and we can access them with our 'validationErrors' definition.
		});
	}

	User.findOne({
			email: email
		}) // We know we will only have one email per user so we use the findOne() function.
		.then(user => {
			if (!user) { // if no (!) user is found we redirect them to the login page. But first we flash a message...
				return res.status(422).render('auth/login', { // we return this so the code starting at User.findOne does not execute. // status(422) sends the '422 Unprocessable Entity' code. Means it was unable to process the contained instructions.
					path: '/login',
					pageTitle: 'Login',
					errorMessage: '<div class="user-message user-message--error"><p>Invalid Email or Password</p></div>', // shows this error message when an error occurs. It contains raw html.
					oldInput: { // this is used for making our user input sticky. For 'postLogin' we have the JS Object filled with the constants defined in 'postLogin'.
						email: email,
						password: password
					},
					validationErrors: [] // create an empty array so it just flashes the message saying Invalid Email or Password and doesn't specify which failed. (not as graceful as the signup page)
				});
			}
			// if a user is found we execute the following using bcrypt to match the password.
			bcrypt
				.compare(password, user.password) // This compares the entered 'password' with the 'user.password' in the database to see if they match. It returns a promise so we add a .then and .catch block.
				.then(doMatch => {
					if (doMatch) {
						console.log("You have been logged in by the controllers/auth.js 'postLogin' function!");
						req.session.isLoggedIn = true; // req the 'session' object which was added by our session middleware. We create a key called 'isLoggedIn' (we can use any name we want) and set it to true.
						req.session.user = user; // this sets the 'session' user equal to 'user'. By setting the user on the session we share it across all requests.
						return req.session.save(err => { // We return this to avoid execution of the res.redirect('/login') line follwing this block. This block tells it to save the session before redirecting so that the database is sure to have written the session before redirecting. (this is only required for timing issues where the page rendering depends on the session being written in the database).
							console.log("if there's an err from postLogin password compare in controllers/auth.js it will be defined: ", err);
							res.redirect('/'); // we don't return this line becuase it's part of the .save() function.
						});
					}
					return res.status(422).render('auth/login', { // we return this so the code starting at User.findOne does not execute. // status(422) sends the '422 Unprocessable Entity' code. Means it was unable to process the contained instructions.
						path: '/login',
						pageTitle: 'Login',
						errorMessage: '<div class="user-message user-message--error"><p>Invalid Email or Password</p></div>', // shows this error message when an error occurs. It contains raw html.
						oldInput: { // this is used for making our user input sticky. For 'postLogin' we have the JS Object filled with the constants defined in 'postLogin'.
							email: email,
							password: password
						},
						validationErrors: [] // create an empty array so it just flashes the message saying Invalid Email or Password and doesn't specify which failed. (not as graceful as the signup page)
					});
				})
				.catch(err => { // on this .catch we don't use the 'newError(err)' because we are redirecting instead of throwing a 500 page.
					console.log("err from postLogin in controllers/auth.js", err);
					res.redirect('/login'); // if there is an err then we get redirected back to login instead of throwing a 500 error.
				});

		})
		.catch(err => {
			console.log("err from postLogin at controllers/auth.js", err)
			const error = new Error(err);
			error.httpStatusCode = 500; // we aren't using this line yet but it bascially sets the value for 'httpStatusCode' to 500.
			return next(error); // when we use next with error called as an argument, Express will skip all middlwares and move right to an error handling middleware (it's found in our app.js).
		});
};

// this is our 'postLogout' function. It activates when the Logout button is selected and clears the session.
exports.postLogout = (req, res, next) => {
	// "requests" from our "session" module the "destroy()"" function which is provided by the session package we're using.
	req.session.destroy(err => {
		console.log("if there's an err from controllers/auth.js 'postLogout', here it is -> ", err); // logs error if we get one.
		console.log("You have been logged out by the controllers/auth.js 'postLogout' function!");
		res.redirect('/'); // after destroying the session we are redirected back to the '/' page.
	});
};

// Non-Functioning Login Code -Matt R.
// exports.login = (req, res, next) =>
// {
//   user.find({email:req.body.email, password: req.body.password}).then(result => {
//     if (result.length > 1) {
//       let error = ["login", "Some error occurred. There are too many people with this username and password"];
//       res.render('auth/login', {
//         pageTitle: 'Login',
//         path: '/views/auth/login',
//         error: error,
//         csrfToken: req.csrfToken()
//       });
//       return;
//     }
//     else if (result.length == 1) {
//       req.session.isLoggedIn = true;
//       res.redirect("/");
//       return;
//     }
//     else {
//       let error = ["login", "Authentication failed"]
//       res.render('auth/login', {
//         pageTitle: 'Login',
//         path: '/views/auth/login',
//         error: error,
//         csrfToken: req.csrfToken()
//       })
//     }
//   }).catch(err => {
//     next(new Error(err));
//   })
// }

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
				cart: {
					items: []
				}
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


exports.getProfile = (req, res, next) => {
	console.log("At getProfile");
	selfProfile = true; //probably should add logic to make see if we're looking at our own profile
	// console.log(req.user);
	Musicians.findOne({
		'userId': req.user._id
	}).then(results => {
				// console.log("This is getting passes as a musicialn?");
				// console.log(results);
		if (results == null) { // This user doesn't have a musician object yet.
			return res.redirect('/admin/add-profile');
		}
		res.render('musician/profile', {
			pageTitle: 'Profile',
			path: '/profile',
			// Obvious placeholder code...
			musician: results,
			selfProfile: selfProfile
		});
	}).catch(err => console.log(err));
};

exports.getOtherProfile = (req, res, next) => {
	const musicianID = req.params.musicianID;
	selfProfile = false; //probably should add logic to make see if we're looking at our own profile
	Musicians.findById(musicianID).then(musicguy => {
		res.render('musician/profile', {
			pageTitle: 'Profile',
			path: '/profile',
			// Obvious placeholder code...
			musician: musicguy,
			selfProfile: selfProfile
		});
	})
}
exports.getProfileByUser = (req, res, next) => {
	console.log("got to getPBU");
	const userID = req.params.userID;
	selfProfile = false; //probably should add logic to make see if we're looking at our own profile
	Musicians.findOne({
		'userId': userID
	}).then(musicguy => {
		res.render('musician/profile', {
			pageTitle: 'Profile',
			path: '/views/musician/profile',
			// Obvious placeholder code...
			musician: musicguy,
			selfProfile: selfProfile
		});
	})
}
exports.getMessageOther = (req, res, next) => {
	console.log("Get to getMO");
	const musicianID = req.params.musicianID;
	Musicians.findById(musicianID).then(musicguy => {
		res.render('musician/message', {
			pageTitle: 'Message',
			path: '/views/musician/message',
			musician: musicguy
		});
	})
}
exports.postMessageOther = (req, res, next) => {
	console.log("Get to postMO");

	User.findById(req.body.user)
		.then(target => {
			if (!target) {
				//Zoidberg: do something on error here, maybe?
				return res.redirect('/');
			}
				transporter.sendMail({
					to: target.email,
					from: 'noreply@mad-matt.com',
					subject: `${req.user.firstName} has sent a message on Tuner`,
					html: `
				<p>${req.user.firstName} ${req.user.lastName} has sent you the following message:</p>
				<br>
				<pre>${req.body.msg_text}</pre>
				<br>
				<p>View ${req.user.firstName}'s profile <a href='https://cse341-g4.herokuapp.com/musician/${req.user._id}'>here</a>.</p'
			`
				});
			res.render('musician/email-success', {
				pageTitle: 'Message',
				path: '/views/musician/message'
			});
		})

}
exports.getTest = (req, res, next) => {
	//console.log(image.path);
}