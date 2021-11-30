const path = require('path');
const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();

router.get('/profile', userController.getProfile);
router.get('/edit-profile', userController.getEditProfile);
router.post('/edit-profile', userController.postEditProfile);

module.exports = router;