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
    //         "musician.first_name": req.body.first_name,
    //         "musician.last_name": req.body.last_name,
    //         "musician.lead_vocals": req.body.lead_vocals,
    //         "musician.backup_vocals": req.body.backup_vocals,
    //         "musician.location.city": req.body.city,
    //         "musician.instruments": req.body.instrument,
    //         "musician.genres": req.body.genre
    // }
    if (req.body.first_name) {
        filters["musician.first_name"] = { $regex : new RegExp(req.body.first_name, "i") };
    }
    if (req.body.last_name) {
        filters["musician.last_name"] = { $regex : new RegExp(req.body.last_name, "i") };
    }
    if (req.body.lead_vocals) {
        filters["musician.lead_vocals"] = true;
    }
    if (req.body.backup_vocals) {
        filters["musician.backup_vocals"] = true;
    }
    if (req.body.city) {
        filters["musician.location.city"] = { $regex : new RegExp(req.body.city, "i") };
    }
    if (req.body.instrument) {
        filters["musician.instruments"] = { $regex : new RegExp(req.body.instrument, "i") };
    }
    if (req.body.genre) {
        filters["musician.genres"] = { $regex : new RegExp(req.body.genre, "i") };
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
