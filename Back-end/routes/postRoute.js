'use strict';

const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();
const multer  = require('multer');
const {body} = require('express-validator');
const passport = require('../utilities/pass');


const validateFileFormat = (req, file, cb) => {
  const allowedMimetypes = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'];
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ dest: 'uploads/', validateFileFormat});

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

router.route('/openedPost/:id')
    .get(postController.get_post_by_id)

router.route('/:id')
    .get(passport.authenticate('jwt', {session: false}), postController.get_post_by_id)
    .post(passport.authenticate('jwt', {session: false}), postController.post_report_post)
    .delete(passport.authenticate('jwt', {session: false}), postController.delete_post_by_id);


module.exports = router;
