// MUSICIAN
// This file defines all of the code required to store and maintain the information that
// is associated with one of our users. There is a fair amount of information here, so I decided
// to seperate this from our user objects. The idea is that you can use the user objects to handle auth
// and the information for displaying users is completely seperate from any sensitive information.
//
// I've also decided to give these functions .then and .catch so that the controllers can choose to throw
// the error or render the error to the page.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MUSICIAN
// This is the schema for one of our users. It contains information about who they are,
// where they play and what instruments they play
const musician = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    city:{
        type: String,
        require: true
    },
    lead_vocals: {
        type: Boolean,
        require: true
    },
    backup_vocals: {
        type: Boolean,
        require: true
    },
    genres: [
        { genreID: {
            type: Schema.Types.ObjectId,
            required: true
        }}
    ],
    instruments: [
        { instrumentID: {
            type: Schema.Types.ObjectId,
            required: true
        }}
    ]
})
// Create the model in compass
musicianTable = mongoose.model("Musicians", musician)


// CRUD FUNCTIONS //

// CREATE MUSICIAN
// add a musician to our table. Each user must have a musician attached do it.
// This function mostly exists to be used when the user is created. Thus 'add user' in
// in user.js calls this function
const createMusician = (musician) => {
    let insert = new musicianTable({
        first_name: musician.first_name,
        last_name: musician.last_name,
        city: musician.city,
        lead_vocals: musician.lead_vocals,
        backup_vocals: musician.backup_vocals,
        genres: musician.genres,
        instruments: musician.instruments
    })
    
    // set up .then and .catch
    return new Promise((resolve, reject) => {
        insert.save().then(result => {
            resolve(result);
        }).catch(err => {
            reject(err)
        })
    })
}

// GET MUSICIAN
// takes a filter for a musician and returns the first musician from the database that matches
const getMusician = (filter) => {
    // set up .then and .catch
    return new Promise((resolve, reject) => {
        musicianTable.findOne(filter).then((result) => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        });
    });
};

// GET MUSICIANS
// takes a filter and returns all of the musician data that matches it
const getMusicians = (filter) => {
    return new Promise((resolve, reject) => {
        musicianTable.find(filter).then((result) => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    });
};

// UPDATE MUSICIAN
// takes a musician object that matches the schema and updates that musician object
const updateMusician = (musician) => {
    // nothing to return, so we will just use reject
    return new Promise((resolve, reject) => {
        musicianTable.findOneAndUpdate({id: musician.id}, musician).error((err) => {
            reject(err);
        });
        
        resolve();
    });
};

// REMOVE MUSICIAN
// this function will remove a musician object from the database. This
// function is intended to be used when a user is deleted. Thus, removeUser in
// user.js calls this function.
const removeMusician = (id) => {
    // nothing to return, so we will just use reject
    return new Promise((resolve, reject) => {
        musicianTable.findByIdAndDelete({id: id}).error((err) => {
            reject(err);
        });

        resolve();
    });
};

//export functions
exports.createMusician = createMusician;
exports.getMusician = getMusician;
exports.getMusicians = getMusicians;
exports.updateMusician = updateMusician;
exports.removeMusician = removeMusician;