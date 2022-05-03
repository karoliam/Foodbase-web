'use strict';

const bcryptjs = require('bcryptjs');
const userModel = require('../models/userModel');
const {validationResult} = require("express-validator");
const {getUserLogin} = require('../models/userModel');
const {deleteAllPostsByUserID} = require('../models/postModel');



//Authentication
const checkToken = (req, res, next) => {
  if (!req.user) {
    next(new Error('token not valid'));
  } else {
    res.json({ user: req.user });
  }
};

//Possibly for moderator to be able to see reported users
const user_get_byId = async (req, res) => {
  console.log('user get by id', req.params.id);
  const userFilter = users.filter((item) => item.id == req.params.id);
  res.json(userFilter[0] || {})
};

//For updating users
const user_profile_put = async (req, res) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('Profile update error', errors);
    res.send(errors.array());
  } else {
    // TODO: Remove this dangerous log before release
    console.log('user controller profile update body', req.body);
    const newUser = {};
    const prefIDS = [];

    // base info for user goes to newUser and are removed from req.body
    newUser.username = req.body.username;
    delete req.body.username;
    newUser.area = req.body.area;
    delete req.body.area;
    newUser.ID = req.body.ID;
    delete req.body.ID;
    newUser.email = req.body.email;
    delete req.body.email;

    console.log("There should be strnums & on here: ",req.body)
    // after deleting other post info theres only preferences left in req.body
    for (const prefsKey in req.body) {
      prefIDS.push(parseInt(prefsKey));
    }

    const profileUpdate = await userModel.updateUser(newUser, prefIDS, res);
    if (profileUpdate) {
      res.json({message: `Profile updated!`, profileUpdated: true});
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
    // TODO: Remove this dangerous log before release
    console.log('user controller password update body', req.body);

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
    const postsDel = await deleteAllPostsByUserID(req.user);
    if (postsDel) {
      console.log('user posts deleted');
      // Then delete user preferences and the user (in the same function currently
      console.log('User controller delete by id: ', req.user.ID);
      const userDel = await userModel.deleteUser(req.user);
      if (userDel){
        return res.json({message: 'User deleted!', deleteSuccessful: true});
      }
    }
    //In case something went wrong
    return res.json({message: 'Something went clearly wrong. Contact administrators!', deleteSuccessful: false});
  }
}

module.exports = {
  user_get_byId,
  user_profile_put,
  user_password_put,
  user_delete_byId,
  checkToken,
};