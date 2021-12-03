// This is helper functionality to enable us to delete files (like images) when editing a product or deleting a product.
const fs = require('fs');

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => { // the 'unlink' method of filesystem (fs) deletes the file connected the 'filepath'.
        if (err) {
            throw ('this error from util/file.js but could have been caused by whatever called deleteFile from the Admin Controller.', err); // if an error is encoutered it throws our 500 page with a message in the console just from me.
        }
    });
}

exports.deleteFile = deleteFile; // this exports our 'deleteFile' function defined above so it can be used in our admin controller.