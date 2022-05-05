'use strict';
const express = require('express');
const userController = require('../controllers/userController');
const multer = require('multer');
const {body, check} = require('express-validator');
const {user_password_put, user_profile_put} = require('../controllers/userController');
const passport = require('../utilities/pass');
const router = express.Router();

//authentication
router.get('/token', userController.checkToken);

//Modifying the profile
router.route('/profile')
.put(multer().none(),
    passport.authenticate('jwt', {session: false}),
    body('email', 'email is not valid').isEmail().isLength({max:40}),
    check('username').escape().isLength({max:40}),
    user_profile_put);

//Modifying the password
router.route('/password')
.put(multer().none(),
    passport.authenticate('jwt', {session: false}),
    body('email', 'email is not valid').isEmail().isLength({max:40}),
    body('password', 'at least 8 characters long').isLength({min:8}),
    check('username').escape().isLength({max:40}),
    user_password_put);

//Moderator tools/user account self-deletion
router.route('/:id')
.get(passport.authenticate('jwt', {session: false}), userController.user_get_byId)
.delete(multer().none(),passport.authenticate('jwt', {session: false}), userController.user_delete_byId);

//exporting the router
module.exports = router;