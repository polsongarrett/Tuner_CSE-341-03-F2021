const path = require('path');
const express = require('express');
const tunerController = require('../controllers/tuner');
const router = express.Router();

// router.get('/', tunerController.getIndex);

router.post('/login',tunerController.login);
router.get('/login', tunerController.getLogin);

router.post('/signup', tunerController.signup);
router.get('/signup', tunerController.getSignup);

router.get('/profile', tunerController.getProfile);

module.exports = router;