'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {body, check} = require('express-validator');
const {login, userCreate_post} = require('../controllers/authorizationController');

router.route('/login')
  .post(multer().none(), login);


router.route('/signup')
    .post(multer().none(),
      body('user.email', 'email is not valid').isEmail(),
      body('user.password', 'at least 8 characters long').isLength({min:8}),
      check('user.username').escape(),
      userCreate_post);

module.exports = router;