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
      body('email', 'email is not valid').isEmail().isLength({max:40}),
      body('old_password', 'at least 8 characters long').isLength({min:8}),
      check('username').escape().isLength({max:40}),
      userCreate_post);

module.exports = router;