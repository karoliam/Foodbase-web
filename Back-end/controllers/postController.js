'use strict';

const postModel = require('../models/postModel');
const {validationResult, body} = require('express-validator');
const {makeThumbnail} = require('../utilities/resize');
const bcryptjs = require("bcryptjs");
const userModel = require("../models/userModel");
const foodFactModel = require("../models/foodFactModel");

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

// modify posts with this
const post_update_put = async (req, res, next) => {
  console.log('request put body', req.body);
  const postInfo = {};
  const prefIDS = [];
  // TODO currently we don't get the modified post's ID in req
  const testID = 1;
  
  // base info for post goes to postInfo and are removed from req.body
  postInfo.area = req.body.area;
  delete req.body.area;
  postInfo.title = req.body.title;
  delete req.body.title;
  postInfo.description = req.body.description;
  delete req.body.description;
  
  // Image filename
  if (typeof req.file !== 'undefined') {
    postInfo.filename = req.file.filename;
  } else {
    postInfo.filename = null;
  }
  
  // after deleting other post info theres only preferences left in req.body
  const prefs = req.body;

  // get food facts from DB
  const foodFacts = await foodFactModel.getAllFoodFacts();

  // compare preferences from req.body food_names to get the ID
  for (const prefItem in prefs) {
    for (let i = 0; i < foodFacts.length; i++) {
      if (prefItem == foodFacts[i].name) {
        console.log('foodFactsin id:', foodFacts[i].ID);
        prefIDS.push(foodFacts[i].ID);
      }
    }
  }

  // send post related data to postModel for DB changes
  const result = await postModel.modifyPost(postInfo,prefIDS,testID,res)
  res.json({message: `post edited succesfully: ${result}`});
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