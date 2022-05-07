'use strict';

const foodFactModel = require('../models/foodFactModel');

const food_fact_list_get = async (req, res) => {
  const foodFacts = await foodFactModel.getAllFoodFacts(res);
  res.json(foodFacts);
};

const post_to_food_fact_get_by_Id = async (req, res) => {
  const foodFacts = await foodFactModel.getPostFoodFacts(req.params.ID);
  res.json(foodFacts);
};

module.exports = {
  food_fact_list_get,
  post_to_food_fact_get_by_Id,
};