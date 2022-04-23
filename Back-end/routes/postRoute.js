'use strict';

const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();
const multer  = require('multer');
const upload = multer({dest: './uploads/'})
const {body} = require('express-validator');


router.route('/')
.get(postController.post_list_get)
.post(upload.single('post'),
    body('post-area').isLength({min: 1}),
    body('expiration').isDate(),
    body('title-edit').isLength({min:1}),
    body('description-edit').isLength({min:1}),
    postController.post_posting)
.put(postController.post_update_put);


router.route('/:id')
.get(postController.get_post_by_id)
.delete(postController.delete_post_by_id);

module.exports = router;
