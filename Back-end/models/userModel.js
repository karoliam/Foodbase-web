'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();
// GET all users
const getAllUsers = async () => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM user');
        return rows;
    } catch (e) {
        console.error('error', e.message);
    }
};
// GET a user based on req.params.id
const getUserByID = async (id, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM user WHERE ID = ?', [id]);
        return rows[0];
    } catch (e) {
        console.error('user, user model getUserByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: userModel getUser' });
        return;
    }
};
// POST a new user
const addUser = async (user, res) => {
    try {
        const [rows] = await promisePool.query('INSERT INTO user(email, password, username, area) VALUES (?,?,?,?)', [user.email, user.password, user.username, user.area]);
        console.log('user model insert', rows);
        return rows.insertId;
    } catch (e) {
        console.error('user model addUser error', e.message);
        res.status(500).json({ message: 'something went wrong src: userModel addUser'});
        return;
    }
};
// PUT modify a user based on req.body.id
const modifyUser = async (user, res) => {
    try {
        const [rows] = await promisePool.query('UPDATE user SET email = ?, password = ?, username = ?, area = ? WHERE ID = ?', [user.email, user.password, user.username, user.area, user.ID]);
        console.log('user model update', rows);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('user model modifyUser error', e.message);
        res.status(500).json({ message: 'something went wrong src: userModel modifyUser'});
        return;
    }
};
// DELETE a user based on req.params.id
const deleteUserByID = async (id, res) => {
    try {
        const [rows] = await promisePool.query('DELETE FROM user WHERE ID = ?', [id]);
        console.log('user model delete', rows);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('user model deleteUserByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: userModel deleteUserByID' });
        return;
    }

};
// exports
module.exports = {
    getAllUsers,
    getUserByID,
    addUser,
    modifyUser,
    deleteUserByID,
};