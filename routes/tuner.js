const path = require('path');
const express = require('express');
const tunerController = require('../controllers/tuner');
const router = express.Router();

// router.get('/', tunerController.getIndex);

router.post('/login',tunerController.postLogin);
router.get('/login', tunerController.getLogin);

router.post('/signup', tunerController.signup);
router.get('/signup', tunerController.getSignup);

router.get('/profile', tunerController.getProfile);
router.get('/musicians/:musicianID', tunerController.getOtherProfile);
router.get('/musician/:userID', tunerController.getOtherProfile);
router.get('/message/:musicianID', tunerController.getMessageOther);
router.post('/message', tunerController.postMessageOther);

router.post('/logout', tunerController.postLogout); // has router use a 'post' method to use the 'postLogin' function in the tunerController.

router.get('/test', tunerController.getTest);

module.exports = router;