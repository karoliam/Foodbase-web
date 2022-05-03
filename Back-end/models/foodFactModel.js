'use strict';
const pool = require('../database/db');
const {json} = require('express');
const promisePool = pool.promise();
// GET all food_facts
const getAllFoodFacts = async () => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM food_fact');
        return rows;
    } catch (e) {
        console.error('error', e.message);
    }
};

// GET food_fact based on req.params.id
const getFoodFactByID = async (id, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM food_fact WHERE ID = ?', [id]);
        return rows[0];
    } catch (e) {
        console.error('food_fact model getFoodFactByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: foodFactModel getFoodFact' });
        return;
    }
};
// GET food_fact ID using name
const getFoodFactIDByName = async (name,res) => {
    try {
        const id = await promisePool.query('SELECT ID FROM food_fact WHERE name =?', name);
        return id;
    } catch (e) {
        console.error('foodFactModel getFoodFactIDByName', e.message);
        res.status(500).json({ message: 'something went wrong src: foodFactModel getFoodFactIDByName' });
        return;
    }
};

// GET food_facts based on post ID
const getPostFoodFacts = async (ID) => {
    try {
        const [rows] = await promisePool.query(
            'SELECT * FROM food_fact WHERE ID IN(SELECT food_fact_ID FROM post_to_food_fact WHERE post_ID = ?)',
            [ID]);
        return rows;
    } catch (e) {
        console.error('error', e.message);
    }
};
const getPostFoodFactsByID = async (id, res, next) => {
    try {
        const [rows] = await promisePool.query('SELECT food_fact.* FROM food_fact LEFT JOIN post_preferences ON food_fact.ID = post_preferences.food_fact_ID WHERE post_ID =?',[id]);
        return rows;
    } catch (e) {
        console.error('foodFactModel getFoodFactIDByName', e.message);
        res.status(500).json({ message: 'something went wrong src: foodFactModel getFoodFactIDByName' });
        next();
    }
}
// exports
module.exports = {
    getAllFoodFacts,
    getFoodFactByID,
    getFoodFactIDByName,
    getPostFoodFacts,
    getPostFoodFactsByID,
};