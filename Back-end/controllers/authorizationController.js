'use strict';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const userModel = require('../models/userModel');
const foodFactModel = require('../models/foodFactModel');
const bcryptjs = require('bcryptjs');
const {validationResult} = require("express-validator");


const login = (req, res, next) => {
  passport.authenticate('local', {session: false}, (error, user) => {
    //In case of errors or missing user
    if (error || !user) {
      return res.status(400).json({
        message: `Authentication failed due to bad credentials`
      });
    }
    //If no errors
    req.login(user, {session: false}, async (error) => {
      if (error)  {
        res.send(error);
      }
      const token = jwt.sign(user, process.env.JWT_SECRET);
      const preferences = await userModel.getUserFoodFacts(user.ID);
      return res.json({user, token, preferences});
    });

  })(req, res, next);
};

const userCreate_post = async (req, res) => {

  // Extract the validation errors from a request.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('user create error', errors);
    res.send(errors.array());
  } else {
    // bcrypted password
    const cryptedPass = await bcryptjs.hash(req.body.password, 13);

    const user = {};
    const prefIDS = [];
    user.username = req.body.username;
    delete req.body.username;
    user.email = req.body.email;
    delete req.body.email;
    user.password = cryptedPass;
    delete req.body.password;
    user.area = req.body.area;
    delete req.body.area;

    // after deleting other post info theres only preferences left in req.body
    for (const prefsKey in req.body) {
      prefIDS.push(parseInt(prefsKey));
    }

    const result = await userModel.createUser(user, prefIDS, res);
    if (result.insertId) {
      res.json({createSuccessful: true});
    } else {
      res.json({error: 'Login error: Contact website administrators'});
    }
  }
};

module.exports = {
  login,
  userCreate_post,
};