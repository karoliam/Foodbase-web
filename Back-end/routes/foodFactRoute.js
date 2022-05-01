'use strict';

const express = require('express');
const {param} = require("express-validator");
const foodFactController = require('../controllers/foodFactController');
const router = express.Router();

router.route('/')
.get(foodFactController.food_fact_list_get)

router.route('/:id')
.get(param('id').isInt(),
    foodFactController.ge)

module.exports = router;
