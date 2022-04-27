'use strict';

const express = require('express');
const foodFactController = require('../controllers/foodFactController');
const router = express.Router();

router.route('/')
.get(foodFactController.food_fact_list_get)

module.exports = router;
