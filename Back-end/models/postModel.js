'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

// -----SELECT-----SELECT-----
// SELECT all posts from DB
const getAllPosts = async (res, next) => {
    try {
        // retrieve all post basic data from DB
        const [rows] = await promisePool.query('SELECT post.*, user.username FROM post LEFT JOIN user ON post.owner_ID = user.ID ORDER BY time_stamp DESC');
        return rows;
    } catch (e) {
        console.error('foodFactModel getFoodFactIDByName', e.message);
        res.status(500).json({ message: 'something went wrong src: foodFactModel getFoodFactIDByName' });
        next();
    }
};

// SELECT post by id from DB
const getPostByID = async (id, res, next) => {
    try {
        // retrieve post basic data from DB by post id
        const [rows] = await promisePool.query('SELECT post.*, user.username FROM post LEFT JOIN user ON post.owner_ID = user.ID WHERE post.ID = ?', [id]);
        return rows;
    } catch (e) {
        console.error('post, post model getPostByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel getPost' });
        next();
    }
};

// SELECT all posts by user id
const getPostsByUserID = async (id, res, next) => {
    try {
        const [rows] = await promisePool.query('SELECT post.*, user.username FROM post LEFT JOIN user ON post.owner_ID = user.ID WHERE post.owner_ID =? ORDER BY time_stamp DESC', [id]);
        return rows;
    } catch (e) {
        console.error('postModel getPostsByUserID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel getPostsByUserID' });
        next();
    }
};

// get post prefs food_fact IDs by post ID
const getPostPrefsByID = async (id, res, next) => {
    try {
        const [rows] = await promisePool.query('SELECT DISTINCT food_fact_ID FROM post_preferences WHERE post_ID=?', [id]);
        return rows;
    } catch (e) {
        console.error('postModel getPostPrefsByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel getPostPrefsByID' });
        next();
    }
}

//-----INSERT-----INSERT-----
// insert post data to DB
const addPost = async (postInfo, prefs, res, next) => {
    try {
        // insert the base post data to DB
        const [rows] = await promisePool.query('INSERT INTO post(filename, description, name, owner_ID, area) VALUES (?,?,?,?,?)',
            [postInfo.filename, postInfo.description, postInfo.title, postInfo.ownerID, postInfo.area]);
        return rows.insertId;
    } catch (e) {
        console.error('post model addPost error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel addPost'});
        next();
    }
};

// insert post preferences by post ids
const addPostPreferences = async (prefsToInsert, res, next) => {
    try {
        // insert post related food fact data to DB
        const [rows] = await promisePool.query('INSERT INTO post_preferences(post_ID, food_fact_ID) VALUES ?',
            [prefsToInsert]);
        return rows.affectedRows;
    } catch (e) {
        console.error('post model addPost error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel addPost'});
        next();
    }
}

//-----SET-----SET-----
// modify existing post
const modifyPost = async (postInfo, res) => {
    try {
        const [rows] = await promisePool.query('UPDATE post SET filename=?, description=?, name=?, area=? WHERE ID = ?',
            [postInfo.filename, postInfo.description, postInfo.title, postInfo.area, postInfo.ID]);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('post model modifyPost error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel modifyPost'});
    }
};

//-----DELETE-----DELETE-----
// delete post by any id this refers to the post ID
const deletePostByID = async (id, res, user) => {
    try {
        // delete post (that belongs to the user) related food fact notes from DB
        const [rows1] = await promisePool.query(
            'DELETE FROM post_preferences WHERE post_ID IN(SELECT ID FROM post WHERE ID = ? AND owner_ID = ?)', [id, user.ID]);
        console.log('items deleted from post_preferences:', rows1.affectedRows);

        // delete the actual post data from DB
        const [rows] = await promisePool.query('DELETE FROM post WHERE ID = ? AND owner_ID = ?', [id, user.ID]);
        console.log('post model delete', rows);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('postModel deletePostByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel deletePostByID' });
    }
};

const deletePostPreferencesById = async (postId, preferenceIds, res) => {
    try {
        const [rows] = await promisePool.query('DELETE FROM post_preferences WHERE post_ID =? AND food_fact_ID IN ?',
            [postId, [preferenceIds]]);
        return rows.affectedRows;
    } catch (e) {
        console.error('postModel deletePostByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel deletePostByID' });
    }
};

module.exports = {
    getAllPosts,
    getPostByID,
    getPostsByUserID,
    getPostPrefsByID,
    addPost,
    addPostPreferences,
    modifyPost,
    deletePostByID,
    deletePostPreferencesById,
};