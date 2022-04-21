'use strict';

// userController
const userModel = require('../models/userModel');
const {validationResult} = require("express-validator");


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
const user_put = async (req, res) => {
  console.log('user controller update body', req.body);
  const newUser = req.body;
  const updated = await userModel.updateUser(req.user, newUser, res);
  res.json({message: `user updated: ${updated}.`});
}

//For deleting accounts
const user_delete_byId = async (req, res) => {
  console.log('User controller delete by id: ', req.params.id);
  const del = await userModel.deleteUser(req.user, req.params.id, res);
  res.json({message: `user deleted: ${del}.`});
}

module.exports = {
  user_get_byId,
  user_put,
  user_delete_byId,
  checkToken,
};