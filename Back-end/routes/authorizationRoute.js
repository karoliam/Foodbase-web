'use strict';
const express = require('express');
const router = express.Router();
const {body, check} = require('express-validator');
const {login, userCreate_post} = require('../controllers/authorizationController');

router.post('/login', login);
router.post('/signup',
    [
      body('email', 'email is not valid').isEmail(),
      body('password', 'at least 8 characters long').
          isLength({min:8}),
      check('name').escape(),
    ],
    userCreate_post
);

module.exports = router;