const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// the next lines define our user schema.
const userSchema = new Schema({
	firstName: {
	  type: String,
	  required: true
	},
	lastName: {
	  type: String,
	  required: true
	},
	email: {
	  type: String,
	  required: true
	},
	password: {
	  type: String,
	  required: true
	},
	resetToken: String,
	restTokenExpiration: Date
  });

// THE FOLLOWING IS STEPHEN'S CODE
// const userSchema = new Schema({
// 	username: {
// 		type: String,
// 		required: true
// 	},
// 	email: {
// 		type: String,
// 		required: true
// 	},
// 	password: {
// 		type: String,
// 		required: true
// 	},
// 	imageUrl: {
// 		type: String,
// 		required: true
// 	},
// 	musician: {
// 		first_name: {
// 			type: String,
// 			required: true
// 		},
// 		last_name: {
// 			type: String,
// 			required: true
// 		},
// 		location: {
// 			city: {
// 				type: String,
// 				require: true
// 			},
// 			country: {
// 				type: String,
// 				require: true
// 			},
// 			longitude: {
// 				type: Number,
// 				require: true
// 			},
// 			latitude: {
// 				type: Number,
// 				require: true
// 			}
// 		},
// 		lead_vocals: {
// 			type: Boolean,
// 			require: true
// 		},
// 		backup_vocals: {
// 			type: Boolean,
// 			require: true
// 		},
// 		genres: [{
// 			genreName: {
// 				type: String,
// 				required: true
// 			}
// 		}],
// 		instruments: [{
// 			instrumentName: {
// 				type: String,
// 				required: true
// 			}
// 		}]
// 	}
// });

module.exports = mongoose.model('User', userSchema);



//How to use the Schema

// Create new user
/*
	const user = new User({
		username: "value",
		email: "value",
		password: "value",
		imageUrl: "value",
		musician: 
		{
			first_name: "value",
			last_name: "value",
			location: {
				city: "value",
				country: "value",
				longitude: 12.5,
				latitude: 6
			},
			lead_vocals: false,
			backup_vocals: true,
			genres: ["Blues", "Jazz", "Swing"],
			instruments: ["Guitar", "Giutar","Banjo","Keyboard"]
		}});
	return user.save();
//*/

//Get Users matching...
/*
 Users.find(
	 { 
		 'email': "Value" 
	})
    .then(results => {
		[...Do things with the results here!...]
      });
    })
    .catch(err => console.log(err));
*/

//Update Users
/*
   Users.findById(UserId)
    .then( foundUser => 
	{
      foundUser.musician.location.city = "Topeaka"; //or other changed values
      return foundUser.save()
	  .then(result => {
        console.log('UPDATED PRODUCT!');
      });
    })
    .catch(err => console.log(err));

*/

//Delete User...
/*
  Users.deleteOne({ 
	  _id: prodId,
	  userId: req.user._id
	})
    .then(() => {
      console.log('DESTROYED PRODUCT');
    })
    .catch(err => console.log(err));
};
*/
