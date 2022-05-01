'use strict';

const express = require('express');
const {param} = require("express-validator");
const foodFactController = require('../controllers/foodFactController');
const router = express.Router();

router.route('/')
.get(foodFactController.food_fact_list_get)

router.route('/:id')
.get(param('id').isInt(),
    foodFactController.post_to_food_fact_get_by_Id)

module.exports = router;
