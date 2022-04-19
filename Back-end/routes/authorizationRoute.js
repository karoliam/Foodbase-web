'use strict';
const express = require('express');
const router = express.Router();
const {body, check} = require('express-validator');
const {login, logout, post_user} = require('../controllers/authorizationController');

router.post('/login', login);
router.get('/logout', logout);
router.post('/signup',
    [
      body('email', 'email is not valid').isEmail(),
      body('password', 'at least 8 characters long').
          isLength({min:8}),
      check('name').escape(),
    ],
    post_user
);

module.exports = router;