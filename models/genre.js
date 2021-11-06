// GENRE
// This is a very simple implementation of an Genre for our database. It is just 
// the name of the Genre. Please let me know if we need to add more to this object

const { resolveInclude } = require('ejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// GENRE
// Here is the very simple schema for an Genres. It is actually just the name of
// Genre
const Genre = new Schema({
    name : {
        type: String,
        required: true
    }
});
// create the table
const genreTable = mongoose.model("Genres", Genre);


// CRUD Functions


// ADD GENRE
// add one item to the document based on the object provided
const addGenre = (genre) => {
    let insert = new genreTable({
        name: genre.name
    })

    return new Promise((resolve, reject) => {
        insert.save().then(() => {
            resolve();
        })
        .catch(err => {
            reject(err);
        });
    })
}

// GET GENRE
// read the first genre that matches the filter
const getGenre = (genre) => {
    return new Promise((resolve, reject) => {
        genreTable.findOne(genre).then(result => {
            resolve(result);
        }) 
        .catch(err => {
            reject(err);
        });
    });
}

// GET GENRES
// read all genres that match the given filter
const getGenres = (genre) => {
    return new Promise((resolve, reject) => {
        genreTable.find(genre).then(result => {
            resolve(result);
        })
        .catch(err => {
            reject(err);
        })
    })
}

// UPDATE GENRE
// update one item in the genre document to the genre object based on the id given
const updateGenre = (id, genre) => {
    return new Promise((resolve, reject) => {
        genreTable.findByIdAndUpdate(id, genre).then(() => {
            resolve();
        })
        .catch(err => {
            reject(err);
        });
    });
}

// DELETE GENRE
// delete one object from the document based on the id.
const deleteGenre = (id) => {
    return new Promise((resolve, reject) => {
        genreTable.findByIdAndDelete(id).then(() => {
            resolve();
        })
        .catch(err => {
            reject(err);
        });
    });
}

// export fuctions
exports.addGenre = addGenre;
exports.getGenre = getGenre;
exports.getGenres = getGenres;
exports.updateGenre = updateGenre;
exports.deleteGenre = deleteGenre;