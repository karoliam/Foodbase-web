'use strict';

const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();
const multer  = require('multer');
const {body} = require('express-validator');
const path = require('path');


const validateFileFormat = (req, file, cb) => {
  const allowedMimetypes = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'];
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//Function for filtering out wrong file types
/* const validateFileFormat = (file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif/;
  // Checking the file extension
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  // Check media type
  const mimetype = allowedExtensions.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: You tried to upload something, which is not an image!');
  }
} */


const upload = multer({ dest: 'uploads/', validateFileFormat});

router.route('/')
.get(postController.post_list_get)
.post(upload.single('picture'),
    body('area', 'Area must contain minimum 2 characters').isLength({min: 2}),
    body('expiration', 'Not a valid date').isDate(),
    body('title', 'Title must contain minimum 2 characters').isLength({min:2}),
    body('description', 'Description must contain minimum 2 characters').isLength({min:2}),
    postController.post_posting)
.put(postController.post_update_put);


router.route('/:id')
.get(postController.get_post_by_id)
.delete(postController.delete_post_by_id);

module.exports = router;
