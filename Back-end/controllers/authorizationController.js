'use strict';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const userModel = require('../models/userModel');
const bcryptjs = require('bcryptjs');
const {validationResult} = require("express-validator");


const login = (req, res, next) => {
  passport.authenticate('local', {session: false}, (error, user) => {
    //In case of errors or missing user
    if (error || !user) {
      return res.status(400).json({
        message: `Authentication failed due to bad credentials}`
      });
    }
    //If no errors
    req.login(user, {session: false}, (error) => {
      if (error)  {
        res.send(error);
      }
      const token = jwt.sign(user, process.env.JWT_SECRET);
      return res.json({user, token});
    });

  })(req, res, next);
};

const userCreate_post = async (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('user create error', errors);
    res.send(errors.array());
  } else {
    // bcrypted password
    const cryptedPass = await bcryptjs.hash(req.body.password, 15);
    //Account role by default is a normal user
    const userRole = 1;

    const user = {
      name: req.body.name,
      email: req.body.email,
      password: cryptedPass,
      role: userRole
    }
    const result = await userModel.createUser(user, res);
    if (result.insertId) {
      res.json({ message: `User added`, user_id: result.insertId });
    } else {
      res.status(400).json({error: 'register error'});
    }
  }
};

module.exports = {
  login,
  userCreate_post,
};