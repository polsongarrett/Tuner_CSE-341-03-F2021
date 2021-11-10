const path = require('path');
const express = require('express');
const tunerController = require('../controllers/tuner');
const router = express.Router();

router.get('/', tunerController.getIndex);

router.get('/login', tunerController.getLogin);

router.get('/signup', tunerController.getSignup);

module.exports = router;