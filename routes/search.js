const path = require('path');
const express = require('express');
const searchController = require('../controllers/search');
const router = express.Router();

router.get('/', searchController.getIndex);
router.get('/search', searchController.getIndex);
router.post('/search', searchController.postSearch);

module.exports = router;