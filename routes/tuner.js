const path = require('path');
const express = require('express');
const tunerController = require('../controllers/tuner');
const router = express.Router();

router.get('/', tunerController.getIndex);

module.exports = router;