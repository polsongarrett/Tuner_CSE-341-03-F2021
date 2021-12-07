const path = require('path');
const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth'); // this brings in our 'is-auth.js' file from our middleware folder so we can use the const isAuth to check for logged in status.
const router = express.Router();

// I put this in the tuner.js routes. -Matt R.-
// router.get('/user-profile', adminController.getUserProfile);

// you always have to have the more specific middleware (i.e. '/add-product') before the less specific middleware (i.e. '/') because '/' will be true on all path requests.
// since we defined the 'router' const above, we now use 'router.use' instead of 'app.use'. Also the same arguments can be used such as 'use', 'post', 'get' or others.
// since we only want to use 'get' requests in this first one we use 'router.get'.
// The following line says "whenever we get a GET request for the route /add-product go ahead and execute the function 'getAddProduct' found in the productsController".
router.get('/add-profile', isAuth, adminController.getAddProfile); // We use 'isAuth' first because the statement is read left to right and we want to check for an authorized user first. The path for the following will read as '/admin/add-product => GET' because we filtered for it in app.js

// we use 'app.post' instead of 'app.use' because 'app.post' will only parse post requests. 'app.use' will parse both 'get' and 'post' requests. You can also use 'app.get' to parse only 'get' requests.
// The following line says "whenever we get a POST request for the route /add-profile go ahead and execute the function 'postAddProduct' found in the productsController".
// we use the array [] to group our validation statements together. You don't have to use an array but it's convenient for organization.
// the path will read as '/admin/add-profile => POST' because we filtered for it in app.js
router.post('/add-profile',
[
    body('firstName') // calls our 'body' const above to use the 'express-validator' with the following values.
        .isAscii() // isAscii(str) is a built-in validator that only allows ascii letters, numbers and some special characters.
        .isLength({ min: 3 }) // sets the minimum length. Could also set max: length as well.
        .trim(), // trims out whitespace
    body('lastName') // calls our 'body' const above to use the 'express-validator' with the following values.
        .isAscii() // isAscii(str) is a built-in validator that only allows ascii letters, numbers and some special characters.
        .isLength({ min: 3 }) // sets the minimum length. Could also set max: length as well.
        .trim(), // trims out whitespace
    body('city') // calls our 'body' const above to use the 'express-validator' with the following values.
        .isAscii() // isAscii(str) is a built-in validator that only allows ascii letters, numbers and some special characters.
        .isLength({ min: 3 }) // sets the minimum length. Could also set max: length as well.
        .trim(), // trims out whitespace
    body('state') // calls our 'body' const above to use the 'express-validator' with the following values.
        .isAscii() // isAscii(str) is a built-in validator that only allows ascii letters, numbers and some special characters.
        .isLength({ min: 2, max: 2 }) // sets the minimum length. Could also set max: length as well.
        .trim() // trims out whitespace
        .withMessage('Use 2-letter State Code'),
    body('country') // calls our 'body' const above to use the 'express-validator' with the following values.
        .isAscii() // isAscii(str) is a built-in validator that only allows ascii letters, numbers and some special characters.
        .isLength({ min: 3, max: 3 }) // sets the minimum length. Could also set max: length as well.
        .trim() // trims out whitespace
        .withMessage('Use 3-letter Country Code'),
    body('genre') // calls our 'body' const above to use the 'express-validator' with the following values.
        .isAscii() // isAscii(str) is a built-in validator that only allows ascii letters, numbers and some special characters.
        .isLength({ min: 3 }) // sets the minimum length. Could also set max: length as well.
        .trim(), // trims out whitespace
    body('instrument') // calls our 'body' const above to use the 'express-validator' with the following values.
        .isAscii() // isAscii(str) is a built-in validator that only allows ascii letters, numbers and some special characters.
        .isLength({ min: 3 }) // sets the minimum length. Could also set max: length as well.
        .trim(), // trims out whitespace
    body('leadVocals')
        .exists()
        .withMessage('Required: Lead Vocals yes or no?'),
    body('backupVocals')
        .exists()
        .withMessage('Required: Backup Vocals yes or no?')

],
    isAuth,
    adminController.postAddProfile
    );

router.get('/edit-profile', adminController.getEditProfile);
router.post('/edit-profile', adminController.postEditProfile);



module.exports = router; // This exports our express module named 'router'. 'router' is a const defined above which holds the 'express.Router()' module.