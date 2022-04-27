'use strict';

const foodFactModel = require('../models/foodFactModel');
const {body} = require('express-validator');

const food_fact_list_get = async (req, res) => {
  const foodFacts = await foodFactModel.getAllFoodFacts();
  res.json(foodFacts);
};

module.exports = {
  food_fact_list_get,
};