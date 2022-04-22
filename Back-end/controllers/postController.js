'use strict';

const postModel = require('../models/postModel');           //model
//  /post/      GET
const get_posts = async (req, res) => {
    const posts = await postModel.getAllPosts();
    res.json(posts);
};

//  /post/:id   GET
const get_post_by_id = async (req, res) => {
    const post = await postModel.getPostByID(req.params.id, res);
    res.json(post || {});
};

//  /post/      PUT
const modify_post = async (req, res) => {
    console.log('request body');
    console.log(req.body);
    const post = req.body;
    const modified = await postModel.modifyPost(post, res);
    res.json({ message: `post modified successfully: ${modified}.` });
};

//  /post/      POST
const create_new_post = async (req, res) => {
    console.log('request body');
    console.log(req.body);
    const post = req.body;
    const id = await postModel.addPost(post, res);
    res.json({ message: `post created with id: ${id}.`});
};

//  /post/      DELETE
const delete_post_by_ID = async (req, res) => {
    console.log('Post controller delete by id', req.params.id);
    const del = await postModel.deletePostByID(req.params.id, res);
    res.json({ message: `post deleted ${del}` });
};

module.exports = {
    get_post_by_id,
    modify_post,
    get_posts,
    create_new_post,
    delete_post_by_ID,
}
