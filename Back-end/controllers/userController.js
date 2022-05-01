'use strict';

const bcryptjs = require('bcryptjs');
const userModel = require('../models/userModel');
const {validationResult} = require("express-validator");
const {getUserLogin} = require('../models/userModel');



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

    const newUser = req.body;

    const profileUpdate = await userModel.updateUser(newUser,res);
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
  console.log('User controller delete by id: ', req.params.id);
  const del = await userModel.deleteUser(req.user, req.params.id, res);
  res.json({message: `user deleted: ${del}.`});
}

module.exports = {
  user_get_byId,
  user_profile_put,
  user_password_put,
  user_delete_byId,
  checkToken,
};