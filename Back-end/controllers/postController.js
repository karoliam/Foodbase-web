'use strict';

const postModel = require('../models/postModel');
const {validationResult} = require('express-validator');
const {makeThumbnail} = require('../utilities/resize');

const post_list_get = async (req, res) => {
  const posts = await postModel.getAllPosts(res);
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

const post_update_put = async (req, res) => {
  console.log('post controller post body',  req.body);
  console.log('post controller post file', req.file);
  const post = req.body;
  const user = req.user;
  const modified = await postModel.modifyPost(post, res, user);
  res.json({message: `post modified successfully: ${modified}.`});
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