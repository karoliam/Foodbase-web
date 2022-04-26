'use strict';

const postModel = require('../models/postModel');
const {validationResult} = require('express-validator');
const {makeThumbnail} = require('../utilities/resize');
const bcryptjs = require("bcryptjs");
const userModel = require("../models/userModel");

const post_list_get = async (req, res) => {
  const posts = await postModel.getAllPosts(res);
  console.log('post_list_get', posts);
  res.json(posts);
};

const get_post_by_id = async (req, res) => {
  const post = await postModel.getPostByID(req.params.id, res);
  res.json(post || {})
};

const post_posting = async (req, res) => {
  console.log('post controller post body',  req.body);
  console.log('post controller post file', req.file);
  if (!req.file) {
    return res.status(400).json(
        {
          message: `post upload failed: file invalid`
        }
    );
  }
  console.log('post controller post file', req.file);

  //stop if validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('validation errors', errors);
    return res.status(400).json ({ message: `validation error:`,
      errors: errors });
  }

  const post = req.body;
  post.owner = req.user_id;
  console.log('post uploaded', post);
  post.filename = req.file.filename;
  console.log('req path', req.file.path);
  console.log('filename' , post.filename);
  await makeThumbnail(req.file.path, post.filename);
  const id = await postModel.addPost(post,req.file, res);
  res.json({message: `post created with ${id}.`});
};

const post_update_put = async (req, res, next) => {

  // Extract the validation errors from a request.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('user create error', errors);
    res.send(errors.array());
  } else {
    let post = req.body.post;

    const post_food_facts = req.body.preferences

    const result = await postModel.modifyPost(post, post_food_facts, res);
    if (result.insertId) {
      res.json({ message: 'post modified!'});
    } else {
      res.status(400).json({error: 'register error'});
    }
  }
};

const delete_post_by_id = async (req, res) => {
  console.log('post controller delete by id', req.params.id);
  const user = req.user;
  const del = await postModel.deletePostByID(req.params.id, res, user);
  res.json({message: `post deleted ${del}`});
};

module.exports = {
  post_list_get,
  get_post_by_id,
  post_posting,
  post_update_put,
  delete_post_by_id,
};