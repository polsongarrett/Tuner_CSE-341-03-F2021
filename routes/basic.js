const path = require('path');

const express = require('express');

const basicController = require('../controllers/basic');

const router = express.Router();

router.get('/basic', basicController.getBasic);

module.exports = router;
