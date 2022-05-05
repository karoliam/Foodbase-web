'use strict';

const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();
const multer  = require('multer');
const {body} = require('express-validator');
const passport = require('../utilities/pass');
const path = require('path');

//Function for filtering out wrong file types
function validateFileFormat(file, cb){
  const allowedExtensions = /jpeg|jpg|png|gif/;
  // Checking the file extension
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  // Checking media type
  const mimetype = allowedExtensions.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  }
  return cb(false);
}
const upload = multer({
  dest: 'uploads/',
  fileFilter: function(_req, file, cb){
    validateFileFormat(file, cb);
  }});

router.route('/')
    .get(postController.post_list_get)
    .post(upload.single('picture'),
        passport.authenticate('jwt', {session: false}),
        body('area', 'Area must contain minimum 2 characters').isLength({min: 2}),
        body('title', 'Title must contain minimum 2 characters').isLength({min:2}),
        body('description', 'Description must contain minimum 2 characters').isLength({min:2}),
        postController.post_posting)
    .put(upload.single('picture'),
        passport.authenticate('jwt', {session: false}),
        body('area', 'Area must contain minimum 2 characters').isLength({min: 2}),
        body('title', 'Title must contain minimum 2 characters').isLength({min:2}),
        body('description', 'Description must contain minimum 2 characters').isLength({min:2}),
        postController.post_update_put);

router.route('/yourPosts/:id')
    .get(passport.authenticate('jwt', {session: false}),
        postController.post_list_get_your_posts);

router.route('/search')
    .post(multer().none(), postController.getPostsByPreferencesAndString);

router.route('/reported')
.get(passport.authenticate('jwt', {session: false}), postController.get_reported_posts)

router.route('/reported/:id')
.post(passport.authenticate('jwt', {session: false}), postController.post_report_post)

router.route('/:id')
.get(postController.get_post_by_id)
.delete(passport.authenticate('jwt', {session: false}), postController.delete_post_by_id);

module.exports = router;
