'use strict';

const postModel = require('../models/postModel');
const foodFactModel = require("../models/foodFactModel");
const {validationResult} = require('express-validator');
const {makeThumbnail} = require('../utilities/resize');

//------Helpful controller functions not connected to routes--------------------
const getPostAndPreference = async (req,id,res) => {
    const postPrefs = await foodFactModel.getPostFoodFactsByID(id, res);
    const postMain = await postModel.getPostByID(id, res);
    const postMainJson = {};
    for (const postMainKey in postMain) {
        postMainJson[`post${postMainKey}`] = postMain[postMainKey];
    }
    postMainJson['post0'].preferences = [];
    for (const postPrefsKey in postPrefs) {
        postMainJson['post0'].preferences.push(postPrefs[postPrefsKey]);
    }
    const post = [];

    // If the request is made by a moderator
    if (req.user) {
        if (req.user.role === 0) {
            // Append the report data to posts
            postMainJson['post0'].reports = await postModel.getPostReportsByID(postMainJson['post0'].ID);
        }
    }
    post.push(postMainJson['post0']);
    return post;
}

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
    const post = await getPostAndPreference(req, req.params.id, res);
    console.log('post with preferences: ', post)
    res.json(post || {})
};

// get all posts for logged in user
const post_list_get_your_posts = async (req, res) => {
    const postMain = await postModel.getPostsByUserID(req.params.id, res);
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
    console.log('post_list_get_your_posts length:', posts.length);
    res.json(posts);
}

const getPostsByPreferencesAndString = async (req, res) => {
    console.log('rekkula bodi',req.body);
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
    delete req.body.keywords;
    let posts = []
    let searchPreferenceArr = []
    for (const bodyKey in req.body) {
        console.log('key',bodyKey)
        searchPreferenceArr.push(parseInt(bodyKey));
    }
    console.log('search ids',searchPreferenceArr)
    if (searchPreferenceArr.length > 0) {
        for (const postMainJsonKey in postMainJson) {
            let postPreferencesArr = [];
            for (const preferencesKey in postMainJson[postMainJsonKey].preferences) {
                postPreferencesArr.push(parseInt(postMainJson[postMainJsonKey].preferences[preferencesKey].ID));
            }
            if (searchPreferenceArr.every( ai => postPreferencesArr.includes(ai))) {
                posts.push(postMainJson[postMainJsonKey])
            }
            // empty the post preferences ID array
        }
    } else {
        for (const postMainJsonKey in postMainJson) {
            posts.push(postMainJson[postMainJsonKey])
        }
    }
    console.log(posts.length);
    res.json(posts);
}

// Get all reported posts (for moderators)
const get_reported_posts = async (req, res) => {
    // Only allow authenticated users with a role of 0 to get reported posts
    if (req.user.role === 0) {
        const reports = await postModel.getAllPostReports();
        let reportedPosts = [];
        for (let i = 0; i<reports.length; i++) {
            // Check if a reportedPost was already created with the same post_ID
            let append = true;
            if (i > 0) {
                if (reportedPosts[i-1].ID === reports[i].post_ID) {
                    append = false;
                }
            }
            if (append) {
                const reportedPost = await getPostAndPreference(req, reports[i].post_ID, res);
                reportedPosts.push(reportedPost[0]);
            }
        }
        console.log(reportedPosts);
        return res.json(reportedPosts);
    }
    res.status(401);
}

//-----POST-----POST-----
// create new post while logged in
const post_posting = async (req, res) => {
    console.log('joo', req.file);
    if (!req.file) {
        return res.json({message: 'post upload failed: file invalid', postCreated: false});
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

    await makeThumbnail(req.file.path, postInfo.filename);
    // create post base data
    const postCreateId = await postModel.addPost(postInfo, res);
    // create post_ID & food_fact_ID value pairs for preferences
    let prefsToInsert = [];
    for (let i = 0; i < newPreferenceIDS.length; i++) {
        prefsToInsert.push([postCreateId, newPreferenceIDS[i]]);
    }
    // create preferences for post
    let prefsAdded = 0;
    if (prefsToInsert.length > 0) {
        prefsAdded = await postModel.addPostPreferences(prefsToInsert, res);
    }
    res.json({postCreated: true});
};

// Post reporting
const post_report_post = async (req, res) => {
    console.log(req.body);
    const report = postModel.addNewReport(req.body.reason, req.body.postID);
    if (report) {
        return res.json({message: "Post reported", reportSuccessful: true});
    }
    res.json({message: "Post report failed!", reportSuccessful: false});
}

//-----PUT-----PUT-----
// modify posts with this
const post_update_put = async (req, res) => {

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
    // Check that the file is not undefined or null
    if (req.file) {
        if (typeof req.file !== 'undefined') {
            postInfo.filename = req.file.filename;
            await makeThumbnail(req.file.path, postInfo.filename);
        }
    } else {
        //keep the old filename
        const oldData = await postModel.getPostByID(postInfo.ID, res);
        postInfo.filename = oldData[0].filename;
    }

    // after deleting other post info theres only preferences left in req.body
    for (const prefsKey in req.body) {
        newPreferenceIDS.push(parseInt(prefsKey));
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
        const delPostPreferences = await postModel.deletePostPreferencesById(postInfo.ID, prefsToDelete, res);
        totalPrefDel += delPostPreferences;
    }
    let totalPrefAdd = 0;
    // if no preferences were ticked in Form there is nothing to add
    if (prefsToInsert.length !== 0) {
        const addPostPreferences = await postModel.addPostPreferences(prefsToInsert, res);
        totalPrefAdd += addPostPreferences;
    }
    // update post's main data to DB
    const result = await postModel.modifyPost(postInfo, res);
    if (result) {
        console.log(`post edited succesfully: ${result} with ${totalPrefDel} preferences deleted and
   ${totalPrefAdd} added.`);
        return res.json({postEdited: true});
    }
    console.log(`post edited: ${result}, ${totalPrefDel} preferences deleted and
   ${totalPrefAdd} added.`);
    res.json({postEdited: false, message: message});
};

//-----DELETE-----DELETE-----
// literally just delete a post by ID
const delete_post_by_id = async (req, res) => {
    console.log('post controller delete by id', req.params.id);
    const postOwner = req.user;
    let postOwnerId = postOwner.ID;

    if (req.user.role === 0) {
        // Delete the reported post (Moderator only)
        // First delete all reports made for this post
        const delReports = await postModel.deletePostReportsByID(req.params.id);
        //Then call moderator post deletion
        if (delReports) {
            // Get the owner_ID of the post
            const postToBeDeleted = await getPostAndPreference(req, req.params.id, res);
            // Assign the owner_ID as the postOwnerId
            postOwnerId = postToBeDeleted[0].owner_ID;
        } else {
            return res.json({});
        }
    }
    // delete post (that belongs to the postOwner) AND related food fact notes from DB
    const delPreferences = await postModel.deletePostPreferencesByIdCheck(req.params.id, postOwnerId);
    console.log('items deleted from post_preferences:', delPreferences);
    const delPost = await postModel.deletePostByID(req.params.id, postOwnerId, res);
    if (delPost) {
        return res.json({message: 'Post deleted!'});
    }
    res.json({message: 'Post deletion failed!'});
}

module.exports = {
    post_list_get,
    get_post_by_id,
    post_list_get_your_posts,
    getPostsByPreferencesAndString,
    get_reported_posts,
    post_posting,
    post_report_post,
    post_update_put,
    delete_post_by_id,
};