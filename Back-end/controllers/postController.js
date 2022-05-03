'use strict';

const postModel = require('../models/postModel');
const foodFactModel = require("../models/foodFactModel");
const {validationResult, body} = require('express-validator');
const {makeThumbnail} = require('../utilities/resize');
const {toInt} = require("validator");

//-----GET-----GET-----
// get all posts from DB with food facts
const post_list_get = async (req, res) => {
    const postMain = await postModel.getAllPosts(res);
    const postMainJson = {};
    for (const postMainKey in postMain) {
        postMainJson[postMainKey] = postMain[postMainKey];
        postMainJson[postMainKey].preferences = [];
    }
    for (const postMainJsonKey in postMainJson) {
        const postPrefs = await foodFactModel.getPostFoodFactsByID([postMainJson[postMainJsonKey].ID]);
        if (postPrefs.length > 0) {
            for (const postPrefsKey in postPrefs) {
                postMainJson[postMainJsonKey].preferences.push(postPrefs[postPrefsKey]);
            }
        }
    }
    let posts = []
    for (const postMainJsonKey in postMainJson) {
        posts.push(postMainJson[postMainJsonKey])
    }
    res.json(posts);
};

// get post by ID with food facts from DB
const get_post_by_id = async (req, res) => {
    const postPrefs = await foodFactModel.getPostFoodFactsByID(req.params.id, res);
    const postMain = await postModel.getPostByID(req.params.id, res);
    const postMainJson = {};
    for (const postMainKey in postMain) {
        postMainJson[`post${postMainKey}`] = postMain[postMainKey];
    }
    postMainJson[`post0`].preferences = [];
    for (const postPrefsKey in postPrefs) {
        postMainJson[`post0`].preferences.push(postPrefs[postPrefsKey]);
    }
    const post = []
    post.push(postMainJson['post0'])
    console.log('post with preferences: ', post)
    res.json(post || {})
};

// get all posts for logged in user
const post_list_get_your_posts = async (req, res) => {
    const posts = await postModel.getPostsByUserID(req.params.id, res);
    console.log('post_list_get_your_posts length:', posts.length);
    res.json(posts);
}

//-----POST-----POST-----
// create new post while logged in
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
        return res.status(400).json({
            message: `validation error:`,
            errors: errors
        });
    }
    console.log('request post body:', req.body);
    const postInfo = {};
    const newPreferenceIDS = [];

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
    for (const prefsKey in req.body) {
        newPreferenceIDS.push(parseInt(prefsKey));
    }

    console.log('req path', req.file.path);
    console.log('filename', postInfo.filename);
    await makeThumbnail(req.file.path, postInfo.filename);
    // create post base data
    const postCreateId = await postModel.addPost(postInfo, res);
    // create post_ID & food_fact_ID value pairs for preferences
    let prefsToInsert = [];
    for (let i = 0; i < newPreferenceIDS.length; i++) {
        prefsToInsert.push([postCreateId, newPreferenceIDS[i]]);
    }
    // create preferences for post
    const prefsAdded = await postModel.addPostPreferences(prefsToInsert, res);
    res.json({message: `post created with id: ${postCreateId} and ${prefsAdded} preferences.`});
};

//-----PUT-----PUT-----
// modify posts with this
const post_update_put = async (req, res) => {
    console.log('request put body', req.body);
    const postInfo = {};
    const newPreferenceIDS = [];

    // base info for post goes to postInfo and are removed from req.body
    postInfo.area = req.body.area;
    delete req.body.area;
    postInfo.title = req.body.title;
    delete req.body.title;
    postInfo.description = req.body.description;
    delete req.body.description;
    postInfo.ID = req.body.ID;
    delete req.body.ID;

    // Image filename
    const oldData = await postModel.getPostByID(postInfo.ID, res);
    if (typeof req.file !== 'undefined') {
        postInfo.filename = req.file.filename;
    } else if (oldData.filename !== null) {
        postInfo.filename = oldData.filename;
    }
    console.log("There should be strnums & on here: ", req.body)
    // after deleting other post info theres only preferences left in req.body
    for (const prefsKey in req.body) {
        newPreferenceIDS.push(parseInt(prefsKey));
    }
    if (typeof req.file !== 'undefined') {
        await makeThumbnail(req.file.path, postInfo.filename);
    }
    // send post related data to postModel for DB changes
    let prefsToDelete = [];
    let prefsToInsert = [];
    const oldPrefs = [];
    // check the preferences in DB with post ID
    const oldRows = await postModel.getPostPrefsByID(postInfo.ID, res);
    for (const rowKey in oldRows) {
        oldPrefs.push(oldRows[rowKey].food_fact_ID);
    }
    // no loop if no preferences existed in DB
    if (oldPrefs.length !== 0) {
        for (let i = 0; i < newPreferenceIDS.length; i++) {
            // check for new preferences to add, we can't add duplicates
            if (!oldPrefs.includes(newPreferenceIDS[i])) {
                prefsToInsert.push([postInfo.ID, newPreferenceIDS[i]]);
            }
        }
    } else {
        for (let i = 0; i < newPreferenceIDS.length; i++) {
            prefsToInsert.push([postInfo.ID, newPreferenceIDS[i]]);
        }
    }
    // no loop if no preferences were ticked in edit form
    if (newPreferenceIDS.length !== 0) {
        for (let i = 0; i < oldPrefs.length; i++) {
            // check what preferences don't exist in the new set
            if (!newPreferenceIDS.includes(oldPrefs[i])) {
                prefsToDelete.push(oldPrefs[i]);
            }
        }
    } else {
        prefsToDelete = prefsToDelete.concat(oldPrefs);
    }
    // if no preferences exist in DB there's nothing to delete
    let totalPrefDel = 0;
    if (prefsToDelete.length !== 0) {
        const delPostPreferences = await postModel.deletePostPreferencesById(postInfo.ID, prefsToDelete, res)
        totalPrefDel += delPostPreferences;
    }
    let totalPrefAdd = 0;
    // if no preferences were ticked in Form there is nothing to add
    if (prefsToInsert.length !== 0) {
        const addPostPreferences = await postModel.addPostPreferences(prefsToInsert, res)
        totalPrefAdd += addPostPreferences;
    }
    // update post's main data to DB
    console.log()
    const result = await postModel.modifyPost(postInfo, res)
    res.json({
        message: `post edited succesfully: ${result} with ${totalPrefDel} preferences deleted and
   ${totalPrefAdd} added.`
    });
};

//-----DELETE-----DELETE-----
// literally just delete a post by ID
const delete_post_by_id = async (req, res) => {
    console.log('post controller delete by id', req.params.id);
    const user = req.user;

    // delete post (that belongs to the user) related food fact notes from DB
    const delPreferences = await postModel.deletePostPreferencesByIdCheck(req.params.id, user.ID);
    console.log('items deleted from post_preferences:', delPreferences);
    const delPost = await postModel.deletePostByID(req.params.id, user.ID, res);
    res.json({message: `Post deleted! ${delPost}`});
};

module.exports = {
    post_list_get,
    get_post_by_id,
    post_list_get_your_posts,
    post_posting,
    post_update_put,
    delete_post_by_id,
};