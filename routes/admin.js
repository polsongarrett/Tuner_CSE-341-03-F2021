const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

// I put this in the tuner.js routes. -Matt R.-
// router.get('/user-profile', adminController.getUserProfile);

module.exports = router;