'use strict';
// Authors Reima N. & Vili M.
const bcryptjs = require('bcryptjs');
const userModel = require('../models/userModel');
const {validationResult} = require("express-validator");
const {getUserFoodFacts} = require('../models/foodFactModel');
const {getUserLogin} = require('../models/userModel');
const {deleteAllPostsPreferencesByUserID, deleteAllPostsByUserID} = require('../models/postModel');
const postModel = require('../models/postModel');
const messageModel = require('../models/messageModel');


//Authentication
const checkToken = (req, res, next) => {
  if (!req.user) {
    next(new Error('token not valid'));
  } else {
    res.json({ user: req.user });
  }
};

//For updating users
const user_profile_put = async (req, res) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('Profile update error', errors);
    res.send(errors.array());
  } else {
    const newUser = {};
    const prefIDS = [];

    // base info for user goes to newUser and are removed from req.body
    newUser.ID = req.body.ID;
    delete req.body.ID;
    newUser.email = req.body.email;
    delete req.body.email;
    newUser.username = req.body.username;
    delete req.body.username;
    newUser.area = req.body.area;
    delete req.body.area;

    // after deleting other post info theres only preferences left in req.body
    for (const prefsKey in req.body) {
      prefIDS.push(parseInt(prefsKey));
    }
    let prefsToDelete = [];
    let prefsToInsert = [];
    const oldPrefs = [];
    // check the preferences in DB with post ID
    const oldRows = await userModel.getUserPrefsByID(newUser.ID, res);
    for (const rowKey in oldRows) {
      oldPrefs.push(oldRows[rowKey].food_fact_ID);
    }
    // no loop if no preferences existed in DB
    if (oldPrefs.length !== 0) { for (let i = 0; i < prefIDS.length; i++) {
      // check for new preferences to add, we can't add duplicates
      if (!oldPrefs.includes(prefIDS[i])) { prefsToInsert.push([newUser.ID, prefIDS[i]]); }
    }
    } else { for (let i = 0; i < prefIDS.length; i++) {
      prefsToInsert.push([newUser.ID, prefIDS[i]]);
    }
    }
    // no loop if no preferences were ticked in edit form
    if (prefIDS.length !== 0) { for (let i = 0; i < oldPrefs.length; i++) {
      // check what preferences don't exist in the new set
      if (!prefIDS.includes(oldPrefs[i])) { prefsToDelete.push(oldPrefs[i]); }
    }
    } else { prefsToDelete = prefsToDelete.concat(oldPrefs); }
    // if no preferences exist in DB there's nothing to delete
    if (prefsToDelete.length !== 0) {
      const delPrefs = await userModel.deleteUserPreferences(newUser.ID, prefsToDelete, res)
      console.log("post foodfact notes deleted: ", delPrefs)
    }
    // if no preferences were ticked in Form there is nothing to add
    if (prefsToInsert.length !== 0) {
      const addPrefs = await userModel.createUserPreferences(prefsToInsert, res);
      console.log("new post foodfact notes added: ", addPrefs);
    }
    const profileUpdate = await userModel.updateUser(newUser, prefIDS, res);
    if (profileUpdate) {
      console.log('newUser', newUser);
      // Grab user preferences and return them and the user
      const userPreferences = await getUserFoodFacts(newUser.ID);
      // Add the user role
      newUser['role'] = req.user.role;
      res.json({user: newUser, preferences: userPreferences, profileUpdated: true});
    }
  }
}

//For updating user password
const user_password_put = async (req, res) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('Password update error', errors);
    res.send(errors.array());
  } else {
    // get the existing user and see if the given old password matches
    const [oldUser] = await getUserLogin([req.body.email]);
    const oldPassword = oldUser.password;

    if (!await bcryptjs.compare(req.body.old_password, oldPassword)) {
      return res.json({message: 'Incorrect old password.'});
    }

    const newUser = req.body;
    // bcrypt the new password and remove the old_password
    newUser.password = await bcryptjs.hash(req.body.password, 13);
    delete newUser.old_password;
    const passwdUpdate = await userModel.updateUserPassword(newUser,res);
    if (passwdUpdate) {
      res.json({message: `Password updated!`, passwordUpdated: true});
    }
  }
}

//For deleting accounts
const user_delete_byId = async (req, res) => {
  //Deletes user preferences, and posts (and their preferences) by this user, and the user.

  // First get the existing user and see if the given password matches
  const [userFromDB] = await getUserLogin([req.user.email]);
  const existingPassword = userFromDB.password;
  if (!await bcryptjs.compare(req.body.password, existingPassword)) {
    return res.json({message: 'Incorrect password.'});
  } else {
    //First delete the posts
    // delete all reports made for this post
    const postsDelReports = await postModel.deleteAllPostReportsByUserID(req.user.ID);
    console.log('users post reports deleted:', postsDelReports);
    // delete post (that belongs to the user) related food fact notes from DB
    const postsDelPrefs = await deleteAllPostsPreferencesByUserID(req.user.ID, res);
    console.log('users post preferences deleted:', postsDelPrefs);
    // delete the actual post data from DB
    const postsDel = await deleteAllPostsByUserID(req.user.ID, res);
    if (postsDel) {
      console.log('user posts deleted');
      // Then delete user preferences and the user (in the same function currently
      console.log('User controller delete by id: ', req.user.ID);

      const userPrefDel = await userModel.deleteUserAllUserPreferences(req.user.ID);
      console.log('user preferences deleted: ', userPrefDel)
      // const userMessagesDel = await messageModel.deleteUserAllUserPreferences(req.user.ID);
      // console.log('user preferences deleted: ', userPrefDel)
      const userDel = await userModel.deleteUser(req.user.ID);
      if (userDel){
        return res.json({message: 'User deleted!', deleteSuccessful: true});
      }
    }
    //In case something went wrong
    return res.json({message: 'Something went clearly wrong. Contact administrators!', deleteSuccessful: false});
  }
}

module.exports = {
  user_profile_put,
  user_password_put,
  user_delete_byId,
  checkToken,
};