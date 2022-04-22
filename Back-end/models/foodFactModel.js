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
// POST add a new food_fact
const addFoodFact = async (fact, res) => {
    try {
        const [rows] = await promisePool.query('INSERT INTO food_fact(name, type) VALUES (?,?)', [fact.name, fact.type]);
        console.log('food_fact model insert', rows);
        return rows.insertId;
    } catch (e) {
        console.error('food_fact model addFoodFact error', e.message);
        res.status(500).json({ message: 'something went wrong src: foodFactModel addFoodFact'});
        return;
    }
};
// PUT modify an existing food_fact based on req.body.id
const modifyFoodFact = async (fact, res) => {
    try {
        const [rows] = await promisePool.query('UPDATE food_fact SET name = ?, type = ? WHERE ID = ?', [fact.name, fact.type, fact.ID]);
        console.log('food_fact model update', rows);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('food_fact model modifyFoodFact error', e.message);
        res.status(500).json({ message: 'something went wrong src: foodFactModel modifyFoodFact'});
        return;
    }
};
// DELETE a food_fact based on req.params.id
const deleteFoodFactByID = async (id, res) => {
    try {
        const [rows] = await promisePool.query('DELETE FROM food_fact WHERE ID = ?', [id]);
        console.log('food_fact model delete', rows);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('food_fact model deleteFoodFactByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: foodFactModel deleteFoodFactByID' });
        return;
    }

};
// exports
module.exports = {
    getAllFoodFacts,
    getFoodFactByID,
    addFoodFact,
    modifyFoodFact,
    deleteFoodFactByID,
};