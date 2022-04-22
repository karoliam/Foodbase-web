'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

//user authentication

const getUserLogin = async (params) => {
  try {
    console.log(params);
    const [rows] = await promisePool.execute(
        'SELECT * FROM food_user WHERE email = ?;',
        params);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }
};


const getAllUsers = async (res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM food_user');
    return rows;
  } catch (e) {
    console.error('userModel getAllUsers error', e.message);
    return;
  }
};

//Possibly for moderator to be able to see flagged users
const getUserById = async (id, res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM food_user WHERE user_id = ?', [id]);
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
    const [rows] = await promisePool.query('INSERT INTO food_user(name, email, password, role, preferences) VALUES (?,?,?,?)',
        [user.name,user.email,user.password,user.role, user.preferences]);
    console.log('user model insert: ', rows);
    return rows;
  } catch (e) {
    console.error('userModel createUser error', e.message);
    res.status(500).json({message: 'An error occurred'});
  }
};

//For updating all kinds of users
const updateUser = async (user, newUser, res) => {
  try {
    if (user.role === 0) {
      //admin can update which user they ever want to.
      const [rows] = await promisePool.query('UPDATE food_user SET name = ?, email = ?, password = ?, role = ? WHERE user_id=?',
          [newUser.name,newUser.email,newUser.passwd,newUser.role, newUser.user_id]);
      console.log('user model admin update: ', rows);
      return rows.affectedRows === 1;
    } else {
      //normal users can update only their own user except for role
      const [rows] = await promisePool.query('UPDATE food_user SET name = ?, email = ?, password = ? WHERE user_id=? AND user_id=?',
          [newUser.name,newUser.email,newUser.passwd, newUser.user_id, user.user_id]);
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
      const [rows] = await promisePool.query('DELETE from food_user WHERE user_id=?', [id]);
      console.log('user model admin delete: ', rows);
      return rows.affectedRows === 1;
    } else {
      //normal users can delete only their own user
      const [rows] = await promisePool.query('DELETE from food_user WHERE user_id=? AND user_id=?', [id, user.user_id]);
      console.log('user model normal delete: ', rows);
      return rows.affectedRows === 1;
    }
  } catch (e) {
    console.error('userModel deleteUser error', e.message);
    res.status(500).json({message: 'something went wrong'});
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