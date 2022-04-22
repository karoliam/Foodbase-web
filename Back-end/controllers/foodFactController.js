'use strict';

const foodFactModel = require('../models/foodFactModel');           //model
//  /food_fact/      GET
const get_food_facts = async (req, res) => {
    const food_facts = await foodFactModel.getAllFoodFacts();
    res.json(food_facts);
};

//  /food_fact/:id   GET
const get_food_fact_by_id = async (req, res) => {
    const fact = await foodFactModel.getFoodFactByID(req.params.id, res);
    res.json(fact || {});
};

//  /food_fact/      PUT
const modify_food_fact = async (req, res) => {
    console.log('request body');
    console.log(req.body);
    const fact = req.body;
    const modified = await foodFactModel.modifyFoodFact(fact, res);
    res.json({ message: `food fact modified successfully: ${modified}.` });
    // res.json(req.params);
    // res.send(`From this endpoint you can modify a food fact.`);
};

//  /food_fact/      POST
const create_new_food_fact = async (req, res) => {
    console.log('request body');
    console.log(req.body);
    const fact = req.body;
    const id = await foodFactModel.addFoodFact(fact, res);
    res.json({ message: `food fact created with id: ${id}.`});
    // res.send(`From this endpoint you can add a food fact.`);
};

//  /food_fact/      DELETE
const delete_food_fact_by_ID = async (req, res) => {
    console.log('Food fact controller delete by id', req.params.id);
    const del = await foodFactModel.deleteFoodFactByID(req.params.id, res);
    res.json({ message: `food fact deleted ${del}` });
};

module.exports = {
    get_food_fact_by_id,
    modify_food_fact,
    get_food_facts,
    create_new_food_fact,
    delete_food_fact_by_ID,
}
