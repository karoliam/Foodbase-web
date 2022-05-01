'use strict';

const postModel = require('../models/postModel');
const {validationResult, body} = require('express-validator');
const {makeThumbnail} = require('../utilities/resize');
const bcryptjs = require("bcryptjs");
const userModel = require("../models/userModel");
const foodFactModel = require("../models/foodFactModel");

const post_list_get = async (req, res) => {
  const posts = await postModel.getAllPosts(res);
  console.log('post_list_get length:', posts.length);
  res.json(posts);
};

const get_post_by_id = async (req, res) => {
  const post = await postModel.getPostByID(req.params.id, res);
  res.json(post || {})
};

const post_posting = async (req, res) => {
  if (!req.file) {
    return res.status(400).json(
        {
          message: `post upload failed: file invalid`
        }
    );
  }
  //stop if validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('validation errors', errors);
    return res.status(400).json ({ message: `validation error:`,
      errors: errors });
  }
  console.log('request post body:', req.body);
  const postInfo = {};
  const prefIDS = [];

  // base info for post goes to postInfo and are removed from req.body
  postInfo.area = req.body.area;
  delete req.body.area;
  postInfo.title = req.body.title;
  delete req.body.title;
  postInfo.description = req.body.description;
  delete req.body.description;
  postInfo.ownerID = req.body.ownerID;
  delete req.body.ownerID;

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

  console.log('req path', req.file.path);
  console.log('filename' , postInfo.filename);
  await makeThumbnail(req.file.path, postInfo.filename);
  const id = await postModel.addPost(postInfo, prefIDS, res);
  res.json({ message: `post created with ${id}.` });
};

// modify posts with this
const post_update_put = async (req, res, next) => {
  console.log(req);
  console.log('request put body', req.body);
  const postInfo = {};
  const prefIDS = [];
  // TODO post ID unknown
  const testID = req.body.ID;
  // base info for post goes to postInfo and are removed from req.body
  postInfo.area = req.body.area;
  delete req.body.area;
  postInfo.title = req.body.title;
  delete req.body.title;
  postInfo.description = req.body.description;
  delete req.body.description;

  // Image filename
  const oldData = await postModel.getPostByID(testID, res);
  if (typeof req.file !== 'undefined') {
    postInfo.filename = req.file.filename;
  } else if (oldData.filename !== null){
    postInfo.filename = oldData.filename;
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
  if (typeof req.file !== 'undefined') {
    await makeThumbnail(req.file.path, postInfo.filename);
  }
  const result = await postModel.modifyPost(postInfo,prefIDS,testID,res)
  res.json({message: `post edited succesfully: ${result}`});
};
// literally just delete a post by ID
const delete_post_by_id = async (req, res) => {
  console.log('post controller delete by id', req.params.id);
  const user = req.user;
  const del = await postModel.deletePostByID(req.params.id, res, user);
  res.json({message: `post deleted ${del}`});
};
// get all posts for specific user ID in req.params.id
const post_list_get_your_posts = async (req, res) => {
  const posts = await postModel.getPostsByUserID(req.params.id, res);
  console.log('post_list_get_your_posts length:', posts.length);
  res.json(posts);
}

module.exports = {
  post_list_get,
  get_post_by_id,
  post_posting,
  post_update_put,
  delete_post_by_id,
  post_list_get_your_posts,
};