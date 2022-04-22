'use strict';
const express = require('express');                                         // express
const multer = require('multer');                                           // multer
const {body} = require('express-validator');                            // express-validator
const router = express.Router();                                            // router
const postController = require('../controllers/postController');            // controller

const upload = multer({ dest: './uploads/' });                       // multer

router.route('/')                                                     // route /post
    .get(postController.get_posts)
    .post(upload.single('post'),
        // body('filename'),
        // body('description').isAlphanumeric(),
        body('name').isLength({ min: 1, max: 1000 }),
        postController.create_new_post)
    .put(upload.single('post'),
        // body('filename'),
        // body('description').isAlphanumeric(),
        body('name').isLength({ min: 1, max: 1000 }),
        postController.modify_post);

router.route('/:id')                                                  // route /post/:id
    .get(postController.get_post_by_id)
    .delete(postController.delete_post_by_ID);

module.exports = router;                                                    // exports

// don't understand why, but I got PUT only working with multer