// INSTRUMENT
// This is a very simple implementation of an instrument for our database. It is just 
// the name of the instrument. Please let me know if we need to add more to this object

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// INSTRUMENT
// Here is the very simple schema for an instruments. It is actually just the name of
// instrument
const instrument = new Schema({
    name : {
        type: String,
        required: true
    }
});
// create the table
const instTable = mongoose.model("Instruments", instrument);


// CRUD Functions


// ADD INSTRUMENT
// Adds one instrument to the model. The instrument object should contain a name.
const addInstrument = (instrument) => {
    insert = new instrument({
        name : instrument.name
    });

    return new Promise((resolve, reject) => {
        insert.save().then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
    });
};

// GET INSTRUMENT
// returns the first result that matches the given object
const getInstrument = (instrument) => {
    return new Promise((resolve, reject) => {
        instTable.findOne(instrument).then(result => {
            resolve(result);
        })
        .catch(err => {
            reject(err);
        });
    })
}

// GET INSTRUMENTS
// returns a list of results that match the given object
const getinstruments = () => {
    return new Promise((resolve, reject) => {
        instTable.find().then(result => {
            resolve(result);
        })
        .catch(err => {
            reject(err);
        })
    })
}


// UPDATE INSTRUMENTS
// sets a single object in the database to the second argument based on the id supplied in the first
// argument
const updateInstrument = (id, instrument) => {
    return new Promise((resolve, reject) => {
        instTable.findByIdAndUpdate(id, instrument).then(() => {
            resolve();
        })
        .catch(err => {
            reject(err);
        });
    });
}

// DELETE INSTRUMENT
// deletes one element based on the id supplied in the argument
const deleteInstrument = (id) => {
    return new Promise((resolve, reject) => {
        instTable.findByIdAndDelete(id).then(() => {
            resolve();
        })
        .catch(err => {
            reject(err);
        });
    });
}

// export functions
exports.addInstrument = addInstrument;
exports.getInstrument = getInstrument;
exports.getinstruments = getinstruments;
exports.updateInstrument = updateInstrument;
exports.deleteInstrument = deleteInstrument;