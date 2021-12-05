const Musicians = require("../models/musician");

exports.getIndex = (req, res, next) => 
{
        Musicians.getMusicians().then(musicians => {
        console.log(musicians);
        res.render('index', {
            pageTitle: 'Search',
            path: '/',
            mus: musicians, //Placeholders to work with index.ejs
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};


exports.postSearch = (req, res, next) => 
{
    let filters = {};
    // let filters = {
    //         "musician.firstName": req.body.firstName,
    //         "musician.lastName": req.body.lastName,
    //         "musician.lead_vocals": req.body.lead_vocals,
    //         "musician.backup_vocals": req.body.backup_vocals,
    //         "musician.location.city": req.body.city,
    //         "musician.instruments": req.body.instrument,
    //         "musician.genres": req.body.genre
    // }
    if (req.body.firstName) {
        filters["firstName"] = { $regex : new RegExp(req.body.firstName, "i") };
    }
    if (req.body.lastName) {
        filters["lastName"] = { $regex : new RegExp(req.body.lastName, "i") };
    }
    if (req.body.lead_vocals) {
        filters["lead_vocals"] = true;
    }
    if (req.body.backup_vocals) {
        filters["backup_vocals"] = true;
    }
    if (req.body.city) {
        filters["location.city"] = { $regex : new RegExp(req.body.city, "i") };
    }
    if (req.body.instrument) {
        filters["instruments"] = { $regex : new RegExp(req.body.instrument, "i") };
    }
    if (req.body.genre) {
        filters["genres"] = { $regex : new RegExp(req.body.genre, "i") };
    }
    console.log(filters);
        Musicians.getMusicians(filters).then(musicians => {
        
        res.render('index', {
            pageTitle: 'Search',
            path: '/search',
            mus: musicians, //Placeholders to work with index.ejs
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
