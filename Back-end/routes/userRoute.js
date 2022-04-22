'use strict';
const express = require('express');                                     // express
const multer = require('multer');                                       // multer
const {body} = require('express-validator');                            // express-validator
const router = express.Router();                                        // router
const userController = require('../controllers/userController');        // controller

const upload = multer();                   // multer

router.route('/')                                                 // route /user
    .get(userController.get_users)
    .post(upload.none(),
        body('email').isEmail(),    // TODO still accepts non emails
        body('password').isLength({ min: 8, max: 45 }),
        body('username').isLength({ min: 3, max: 45 }),
        body('area').isAlphanumeric(),
        // body('role').isNumeric(),
        userController.create_new_user)
    .put(upload.none(),
        body('email').isEmail(),
        body('password').isLength({ min: 8, max: 45 }),
        body('username').isLength({ min: 3, max: 45 }),
        body('area').isAlphanumeric(),
        // body('role').isNumeric(),
        userController.modify_user);

router.route('/:id')                                              // route /user/:id
    .get(userController.get_user_by_id)
    .delete(userController.delete_user_by_ID);

module.exports = router;                                                // exports

// don't understand why, but I got PUT only working with multer