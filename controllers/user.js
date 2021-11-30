const User = require("../models/user");
const Musician = require("../models/musician");

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

// TODO: load user info from database and render edit-profile view
exports.getEditProfile = (req, res, next) => 
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

exports.postEditProfile = (req, res, next) => 
{
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
  const updatedLead_vocals = true;
  const updatedBackup_vocals = false;
  const updatedGenres = ["Country", "R&B", "Rock"];
  const updatedInstruments = ["Guitar", "Banjo", "Piano"];
  
  // DELETE 
  const updatedUser = new User({
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
  });

  User.findById(userId)
    .then(user => {
      // user = updatedUser;
      // user.username = updatedUsername;
      // user.imageURl = updatedImageUrl;
      // user.email = updatedEmail;
      // user.password = updatedPassword;
      // user.musician.firstName = updatedFirstName;
      // user.musician.lastName = updatedLastName;
      // user.musician.genres = updatedGenres;
      // user.musician.instruments = updatedInstruments;
      // user.musician.lead_vocals = updatedLead_vocals;
      // user.musician.backup_vocals = updatedBackup_vocals;
      // user.musician.location.city = updatedCity;
      // user.musician.location.country = updatedCountry;
      // user.musician.location.longitude = updatedLongitude;
      // user.musician.location.latitude = updatedLatitude;

      
      
      // return user.save()
      console.log(user.musician.genres);
      console.log(updatedUser.musician.genres);
    })
    .then(result => {
      res.redirect("/profile");
    })
    .catch(err => {
      console.log(err);
    });
    
    
  // DELETE

  // User.findById(userId).then(user => {
  //   // console.log(user, userId)
  //   user.username = updatedUsername;
  //   user.imageUrl = updatedImageUrl;
  //   user.email = updatedEmail;
  //   user.password = updatedPassword;
  //   user.musician.firstName = updatedFirstName;
  //   user.musician.lastName = updatedLastName;
  //   user.musician.city = updatedCity;
  //   user.musician.lead_vocals = updatedLead_vocals;
  //   user.musician.backup_vocals = updatedBackup_vocals;
  //   user.musician.genres = updatedGenres;
  //   user.musician.instruments = updatedInstruments;
  //   return user.save()
  //   .then(result => {
  //     res.redirect("/profile");
  //   })
  // })
  // .catch(err => {
  //   console.log(err);
  // });

  // res.render('musician/profile', {
  //     pageTitle: 'Profile',
  //     path: '/views/musician/profile',
  //     // Obvious placeholder code...
  //     musician: {
  //       name: "Bill",
  //       imageUrl: "images/bill-and-guitar.jpg",
  //       instrument: "Guitar",
  //       address: "320 Elm St.",
  //       city: "Nashville"
  //     }
  // });
};