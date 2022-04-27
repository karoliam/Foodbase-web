'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();
const foodFactModel = require('../models/foodFactModel');

//user authentication
const getUserLogin = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT * FROM user WHERE email = ?;',
        params);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }
};


const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.query('SELECT ID,email,username,area FROM user');
    return rows;
  } catch (e) {
    console.error('userModel getAllUsers error', e.message);
    return;
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
    return;
  }
};

//For creating new users
const createUser = async (user, res) => {
  try {
    const [rows] = await promisePool.query('INSERT INTO user(username, email, password, area) VALUES (?,?,?,?)',
        [user.username,user.email,user.password,user.area]);

    //Remove all but user preferences
    let userPreferences = user;
    delete userPreferences.username;
    delete userPreferences.email;
    delete userPreferences.password;
    delete userPreferences.area;


    // Add all user preference names into an array
    let preferencesInArray = [];
    for (const pref in userPreferences) {
      preferencesInArray.push(pref);
    }

    // All food_facts from the db
    const foodFacts = await foodFactModel.getAllFoodFacts();

    // For every preference name that exists in name array data we add the ID to the Database
    for (const i in foodFacts) {
      if (preferencesInArray.includes(foodFacts[i].name)) {
        // Number to be inserted as the food_fact_ID
        const prefNumber = foodFacts[i].ID;
        const [prefRows] = await promisePool.query('INSERT INTO user_preferences(user_ID, food_fact_ID) VALUES (?,?)',
            [rows.insertId, prefNumber]);
      }
    }

    console.log('user model insert: ', rows);
    return rows;
  } catch (e) {
    console.error('userModel createUser error', e.message);
    res.status(500).json({message: 'An error occurred src: userModel createUser'});
  }
};

//For updating all kinds of users
const updateUser = async (user, newUser, res) => {
  try {
    if (user.role === 0) {
      //admin can update which user they ever want to.
      const [rows] = await promisePool.query('UPDATE user SET username = ?, password = ?, role = ? WHERE id=?',
          [newUser.name,newUser.password,newUser.role, newUser.user_id]);
      console.log('user model admin update: ', rows);
      return rows.affectedRows === 1;
    } else {
      //normal users can update only their own user except for role
      const [rows] = await promisePool.query('UPDATE user SET username = ?, password = ? WHERE id=? AND user_id=?',
          [newUser.name,newUser.password, newUser.user_id, user.user_id]);
      console.log('user model normal update: ', rows);
      return rows.affectedRows === 1;
    }
  } catch (e) {
    console.error('userModel updateUser error', e.message);
    res.status(500).json({message: 'something went wrong'});
  }
};

//For deleting users
const deleteUser = async (user, id, res) => {
  try {
    if (user.role === 0) {
      //Moderator can delete which user they ever want to.
      // delete preferences
      const [rows1] = await promisePool.query('DELETE from user_preferences WHERE id=?', [id]);
      // delete user
      console.log('user model admin delete user_preferences: ', rows1);
      const [rows] = await promisePool.query('DELETE from user WHERE id=?', [id]);
      console.log('user model admin delete: ', rows);
      return rows.affectedRows === 1;
    } else {
      //normal users can delete only their own user
      // delete preferences
      const [rows1] = await promisePool.query('DELETE from user_preferences WHERE id=?', [id]);
      // delete user
      console.log('user model normal delete user_preferences: ', rows1);
      const [rows] = await promisePool.query('DELETE from user WHERE id=? AND id=?', [id, user.user_id]);
      console.log('user model normal delete: ', rows);
      return rows.affectedRows === 1;
    }
  } catch (e) {
    console.error('userModel deleteUser error', e.message);
    res.status(500).json({message: 'something went wrong src: userModel deleteUser'});
    return;
  }
};
const getUserPreferencesByID = async (id,res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM user_preferences WHERE ID = ?', [id]);
    return rows;
  } catch (e) {
    console.error('userModel getUserPreferencesByID error', e.message);
    res.status(500).json({ message: 'something went wrong src: userModel getUserPreferencesByID' });
    return;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserLogin,
  getUserPreferencesByID,
}