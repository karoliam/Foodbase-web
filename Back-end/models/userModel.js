'use strict';
// Authors Reima N. & Vili M.
const pool = require('../database/db');
const promisePool = pool.promise();

//user authentication
const getUserLogin = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT * FROM user WHERE email = ?;', params);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }
};

//-----SELECT-----SELECT-----
// SELECT all users from DB
const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.query('SELECT ID,email,username,area FROM user');
    return rows;
  } catch (e) {
    console.error('userModel getAllUsers error', e.message);
  }
};

//Possibly for moderator to be able to see flagged users
const getUserById = async (id, res) => {
  try {
    const [rows] = await promisePool.query('SELECT ID,email,username,area FROM user WHERE id = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('userModel getUserById error', e.message);
    res.status(500).json({message: 'something went wrong'});
  }
};

//For getting the user preferences
const getUserPreferencesByID = async (id,res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM user_preferences WHERE ID = ?', [id]);
    return rows;
  } catch (e) {
    console.error('userModel getUserPreferencesByID error', e.message);
    res.status(500).json({ message: 'something went wrong' });
  }
};

// GET food_facts based on user ID
const getUserPrefsByID = async (id, res) => {
  try {
    const [rows] = await promisePool.query('SELECT DISTINCT food_fact_ID FROM user_preferences WHERE user_ID=?', [id]);
    return rows;
  } catch (e) {
    console.error('userModel getUserPrefsByID error', e.message);
    res.status(500).json({ message: 'something went wrong' });
  }
};

//-----POST-----POST-----
//For creating new users
const createUser = async (user, res) => {
  try {
    const [rows] = await promisePool.query('INSERT INTO user(username, email, password, area) VALUES (?,?,?,?)',
        [user.username,user.email,user.password,user.area]);
    return rows;
  } catch (e) {
    console.error('userModel createUser error', e.message);
    res.status(500).json({message: 'An error occurred'});
  }
};

//For creating new users preferences
const createUserPreferences = async (prefsToInsert, res) => {
  try {
    const [rows] = await promisePool.query('INSERT INTO user_preferences(user_ID, food_fact_ID) VALUES ?',
        [prefsToInsert]);
    return rows.affectedRows;
  } catch (e) {
    console.error('userModel createUserPreferences error', e.message);
    res.status(500).json({message: 'An error occurred'});
  }
};

//-----PUT-----PUT-----
//For updating users as a regular user
const updateUser = async (newUser, res) => {
    try {
    const [rows] = await promisePool.query('UPDATE user SET username = ?, area = ? WHERE ID=? AND email=?',
        [newUser.username, newUser.area, newUser.ID, newUser.email]);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('userModel updateUser error', e.message);
    res.status(500).json({message: 'something went wrong'});
  }
};

//For updating user password
const updateUserPassword = async (newUser, res) => {
  try {
    const [rows] = await promisePool.query('UPDATE user SET password = ? WHERE ID=? AND email=?',
        [newUser.password, newUser.ID, newUser.email]);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('userModel updateUserPassword error', e.message);
    res.status(500).json({message: 'something went wrong'});
  }
};

//-----DELETE-----DELETE-----
//For deleting users
const deleteUser = async (userId) => {
  try {
    const [rows] = await promisePool.query('DELETE from user WHERE ID=?', [userId]);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('userModel deleteUser error', e.message);
    return false;
  }
};

//For deleting users
const deleteUserAllUserPreferences = async (userId) => {
  try {
    const [rows] = await promisePool.query('DELETE from user_preferences WHERE user_ID=?', [userId]);
    return rows.affectedRows;
  } catch (e) {
    console.error('userModel deleteUser error', e.message);
    return false;
  }
};

// DELETE preferences from user
const deleteUserPreferences = async (userId, prefsToDelete, res) => {
  try {
    const [rows] = await promisePool.query('DELETE FROM user_preferences WHERE user_ID =? AND food_fact_ID IN ?',
        [userId, [prefsToDelete]]);
    return rows.affectedRows;
  } catch (e) {
    console.error('userModel getUserPrefsByID error', e.message);
    res.status(500).json({ message: 'something went wrong' });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserPreferencesByID,
  getUserPrefsByID,
  createUser,
  createUserPreferences,
  updateUser,
  updateUserPassword,
  deleteUser,
  deleteUserAllUserPreferences,
  getUserLogin,
  deleteUserPreferences,
}