'use strict';
const pool = require('../database/db');
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
        console.error('food_fact, food_fact model getFoodFactByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: foodFactModel getFoodFact' });
        return;
    }
};
// exports
module.exports = {
    getAllFoodFacts,
    getFoodFactByID,
};