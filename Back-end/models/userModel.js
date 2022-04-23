'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

//user authentication
const getUserLogin = async (params) => {
  try {
    console.log(params);
    const [rows] = await promisePool.execute(
        'SELECT * FROM user WHERE email = ?;',
        params);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }
};


const getAllUsers = async (res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM user');
    return rows;
  } catch (e) {
    console.error('userModel getAllUsers error', e.message);
    return;
  }
};

//Possibly for moderator to be able to see flagged users
const getUserById = async (id, res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM user WHERE id = ?', [id]);
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
    // TODO here the user still has all values
    const [rows] = await promisePool.query('INSERT INTO user(email, password, username, area) VALUES (?,?,?,?)',
        [user.name,user.email,user.password,user.area]);
    // TODO delete non-preference stuff here
    delete user.name;
    delete user.email;
    delete user.password; // TODO or passwd
    delete user.area;
    // TODO now we should only have the prefs
    for (const pref in user) {
      // TODO atm this only works with numbers
      const [rows1] = await promisePool.query('INSERT INTO user_prefences(user_ID, food_fact_ID) VALUES (?,?)',
          [rows.insertId, user[pref]]);
      console.log("preference created with id:",rows1.insertId);
    };
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

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserLogin,
}