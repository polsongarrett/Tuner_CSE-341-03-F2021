const musicianModel = require("../models/musician");

exports.getIndex = (req, res, next) => 
{
    // let musicians = [
    //     {
    //         first_name: "Charles Hardin \"Buddy\"",
    //         last_name: "Holly",
    //         city: "Lubbock, Texas",
    //         lead_vocals: true,
    //         backup_vocals: true,
    //         genres: [],
    //         instruments: []
    //     },
    //     {

    //     }
    // ]
1
    const musicians = musicianModel.getMusicians();
  res.render('index', {
      pageTitle: 'Search',
      path: '/',
      mus: musicians, //Placeholders to work with index.ejs
      genres: [],
      instruments: []
  });
};
