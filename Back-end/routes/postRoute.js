'use strict';

const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();
const multer  = require('multer');
const {body} = require('express-validator');


const validateFileFormat = (req, file, cb) => {
  const allowedMimetypes = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'];
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ dest: './uploads/', validateFileFormat });

router.route('/')
.get(postController.post_list_get)
.post(upload.single('post'),
    body('post-area', 'Area must contain minimum 2 characters').isLength({min: 2}).escape(),
    body('expiration', 'Not a valid date').isDate(),
    body('title-edit', 'Title must contain minimum 2 characters').isLength({min:2}).escape(),
    body('description-edit', 'Description must contain minimum 2 characters').isLength({min:2}).escape(),
    postController.post_posting)
.put(postController.post_update_put);


router.route('/:id')
.get(postController.get_post_by_id)
.delete(postController.delete_post_by_id);

module.exports = router;
