'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

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

    // For every preference name (=ID) we add the ID to the Database
    for (const pref in userPreferences) {
      const [prefRows] = await promisePool.query('INSERT INTO user_preferences(user_ID, food_fact_ID) VALUES (?,?)',
          [rows.insertId, pref]);
    }
    // TODO: Remove this dangerous log before release
    console.log('user model insert: ', rows);
    return rows;
  } catch (e) {
    console.error('userModel createUser error', e.message);
    res.status(500).json({message: 'An error occurred src: userModel createUser'});
  }
};

//For updating users
const updateUser = async (newUser, res) => {
  try {
    //Users can update only their own username, area
    const [rows] = await promisePool.query('UPDATE user SET username = ?, area = ? WHERE ID=? AND email=?',
        [newUser.username, newUser.area, newUser.ID, newUser.email]);
    // TODO: Remove this dangerous log before release
    console.log('user model update: ', rows);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('userModel updateUser error', e.message);
    res.status(500).json({message: 'something went wrong'});
  }
};

//For updating user password
const updateUserPassword = async (newUser, res) => {
  try {
    //Update the user's password. Just in case check that the email also matches
    // TODO: Remove this dangerous log before release
    console.log('newUser at usermodel', newUser);
    const [rows] = await promisePool.query('UPDATE user SET password = ? WHERE ID=? AND email=?',
        [newUser.password, newUser.ID, newUser.email]);
    // TODO: Remove this dangerous log before release
    console.log('user model password update: ', rows);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('userModel updateUserPassword error', e.message);
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
  }
};

//For getting the user preferences

const getUserPreferencesByID = async (id,res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM user_preferences WHERE ID = ?', [id]);
    return rows;
  } catch (e) {
    console.error('userModel getUserPreferencesByID error', e.message);
    res.status(500).json({ message: 'something went wrong src: userModel getUserPreferencesByID' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  getUserLogin,
  getUserPreferencesByID,
}