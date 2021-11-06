// USER
// This file contains all of the code required to define and maintain authorization information. I
// decided to keep this information seperate from the musicians public information for security and
// because it all feels somewhat cleaner this way.
//
// I've also decided to give these functions .then and .catch so that the controllers can choose to throw
// the error or render the error to the page rather than the model.

const musicians = require('./musician');
const mongoose = require('mongoose');
const { resolveInclude } = require('ejs');
const Schema = mongoose.Schema;

// USER
// this is the schema for user authentication. It contains an username, email and password.
const user = new Schema({
    username : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    musician : {
        type: Schema.Types.ObjectId,
        required: true
    }
});
// create the table
const userTable = mongoose.model("Users", user)


// CRUD Functions


// ADD USER
// this function adds a user to the user table. It assumes that the password has already been hashed.
// This funcation takes in two objects. The User object, who's schema is represented above, and the
// musician object, which is defined in musician.js. I have noted the format for that object here
//
// first_name : string
// last_name : string
// city : string
// lead_vocals : bool
// backup_vocals : bool
// genres : list of genre ids
// instruments : list of instrument ids
const addUser = (user, musician) => {
    // set up .then and .catch
    return new Promise((resolve, reject) => {
        // start by creating the musician object
        musicians.createMusician(musician).then(result =>{
            // now that we have a musician create the user for the musician
            let user = new userTable({
                username: user.username,
                email: user.email,
                password: user.password,
                musician: result.id
            });

            // save the user and catch any errors
            user.save().then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            })
        })
        .catch(err => {
            reject(err);
        });
    });
}

// CHECK FOR USER
// takes in a user object that is used as a filter to see if the user exists. This function returns all users
// who match the filter, or returns null if they do not exist.
const checkForUser = (user) => {
    return new Promise((resolve, reject) => {
        userTable.find(user).then(result => {
            if (result.length >= 1) {
                resolve(result);
            }
            else {
                resolve(null);
            }
        })
        .catch(err => {
            reject(err);
        });
    });
}

// CHECK FOR ONE USER
// takes in a user object that is used as a filter to see if this user exists and is unique. This function
// returns the one user if they exist, null if they do not exist and errors if there is more than one user
// that matches the filter
const checkForOneUser = (user) => {
    // set up .then and .catch
    return new Promise((resolve, reject) => {
        // get all users that match the argument
        userTable.find(user).then(result => {
            // check the number of results
            if (result.length == 1) resolve(result[0])
            else if (result.length == 0) resolve(null)
            else if (result.length > 1) 
                reject(new Error("There are multiple users that match this description"))
            else
                reject(new Error("Somehow the number of users matching this description are negative"))
        })
    })
}

// GET USER MUSICIAN
// takes in a user id and returns the corresponding musician id
const getUserMusician = (userId) => {
    // set up .then and .catch
    return new Promise((resolve, reject) => {
        //find the user
        userTable.findById(userId).then(result => {
            // return their musician id
            resolve(result[0].musician);
        })
        .catch(err => {
            reject(err);
        });
    });
}

// UPDATE USER
// this function updates a users auth information and musician id, and then returns the user
const updateUser = (id, user) => {
    // set up .then and .catch
    return new Promise((resolve, reject) => {
        userTable.findByIdAndUpdate(id, user).then(user => {
            resolve(user);
        })
        .catch(err => {
            reject(err);
        });
    });
}

// DELETE USER
// this function will delete a user and its associated musician
const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        userTable.findById(id).then(result => {
            musicians.removeMusician(result.musician).then(() => {
                userTable.findByIdAndDelete(id).catch(err => {
                    reject(err);
                })
                resolve();
            })
            .catch(err => {
                reject(err);
            });
        })
        .catch(err => {
            reject(err);
        });
    });
}


// function exports
exports.addUser = addUser;
exports.checkForUser = checkForUser;
exports.checkForOneUser = checkForOneUser;
exports.getUserMusician = getUserMusician;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;