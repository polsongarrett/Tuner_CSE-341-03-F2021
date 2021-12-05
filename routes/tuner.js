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

router.post('/logout', tunerController.postLogout); // has router use a 'post' method to use the 'postLogin' function in the tunerController.

module.exports = router;