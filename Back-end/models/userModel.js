'use strict';

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
    return rows;
  } catch (e) {
    console.error('userModel createUser error', e.message);
    res.status(500).json({message: 'An error occurred src: userModel createUser'});
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
    res.status(500).json({message: 'An error occurred src: userModel createUserPreferences'});
  }
};

//For updating users
const updateUser = async (newUser, newPrefs, res) => {
    try {
      let prefsToDelete = [];
      let prefsToInsert = [];
      const oldPrefs = [];
      // check the preferences in DB with post ID
      const oldRows = await getUserPrefsByID(newUser.ID, res);
      for (const rowKey in oldRows) {
        oldPrefs.push(oldRows[rowKey].food_fact_ID);
      }
      // no loop if no preferences existed in DB
      if (oldPrefs.length !== 0) { for (let i = 0; i < newPrefs.length; i++) {
        // check for new preferences to add, we can't add duplicates
        if (!oldPrefs.includes(newPrefs[i])) { prefsToInsert.push([newUser.ID, newPrefs[i]]); }
      }
      } else { for (let i = 0; i < newPrefs.length; i++) {
        prefsToInsert.push([newUser.ID, newPrefs[i]]);
      }
      }
      // no loop if no preferences were ticked in edit form
      if (newPrefs.length !== 0) { for (let i = 0; i < oldPrefs.length; i++) {
        // check what preferences don't exist in the new set
        if (!newPrefs.includes(oldPrefs[i])) { prefsToDelete.push(oldPrefs[i]); }
      }
      } else { prefsToDelete = prefsToDelete.concat(oldPrefs); }
      console.log("juhaneita :",prefsToInsert)
      console.log("juhaneita :",prefsToDelete)
      // if no preferences exist in DB there's nothing to delete
      if (prefsToDelete.length !== 0) {
        const [delRows] = await promisePool.query('DELETE FROM user_preferences WHERE user_ID =? AND food_fact_ID IN ?',
            [newUser.ID, [prefsToDelete]]);
        console.log("post foodfact notes deleted: ", delRows.affectedRows)
      }
      // if no preferences were ticked in Form there is nothing to add
      if (prefsToInsert.length !== 0) {
        const [addRows] = await promisePool.query('INSERT INTO user_preferences(user_ID, food_fact_ID) VALUES ?',
            [prefsToInsert]);
        console.log("new post foodfact notes added: ", addRows.affectedRows);
      }
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
const deleteUser = async (user) => {
  try {
    //normal users can delete only their own user
    // delete preferences
    const [rows1] = await promisePool.query('DELETE from user_preferences WHERE user_ID=?', [user.ID]);
    // delete user
    console.log('user model normal delete user_preferences: ', rows1);
    const [rows] = await promisePool.query('DELETE from user WHERE ID=?', [user.ID]);
    console.log('user model normal delete: ', rows);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('userModel deleteUser error', e.message);
    return false;
  }
};

//For deleting users with administrator privileges
const adminDeleteUser = async (AdminUser, toBeDelUserID) => {
  try {
    if (AdminUser.role === 0) {
      //Moderator can delete which user they ever want to.
      // delete preferences
      const [rows1] = await promisePool.query('DELETE from user_preferences WHERE user_ID=?', [toBeDelUserID]);
      // delete user
      console.log('user model admin delete user_preferences: ', rows1);
      const [rows] = await promisePool.query('DELETE from user WHERE ID=?', [toBeDelUserID]);
      console.log('user model admin delete: ', rows);
      return rows.affectedRows === 1;
    }
  } catch (e) {
    console.error('userModel deleteUser error', e.message);
    return false;
  }
}

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

// GET food_facts based on user ID
const getUserPrefsByID = async (id, res) => {
  try {
    const [rows] = await promisePool.query('SELECT DISTINCT food_fact_ID FROM user_preferences WHERE user_ID=?', [id]);
    return rows;
  } catch (e) {
    console.error('userModel getUserPrefsByID error', e.message);
    res.status(500).json({ message: 'something went wrong src: userModel getUserPrefsByID' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  createUserPreferences,
  updateUser,
  updateUserPassword,
  deleteUser,
  getUserLogin,
  getUserPreferencesByID,
  getUserPrefsByID,
}