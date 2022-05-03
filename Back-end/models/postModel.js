'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

// -----SELECT-----SELECT-----
// SELECT all posts from DB
const getAllPosts = async (res) => {
    try {
        // retrieve all post basic data from DB
        const [rows] = await promisePool.query('SELECT post.*, user.username FROM post LEFT JOIN user ON post.owner_ID = user.ID ORDER BY time_stamp DESC');
        return rows;
    } catch (e) {
        console.error('postModel getAllPosts error', e.message);
        res.status(500).json({ message: 'something went wrong src: getAllPosts getAllPosts' });
    }
};

// SELECT post by id from DB
const getPostByID = async (id, res) => {
    try {
        // retrieve post basic data from DB by post id
        const [rows] = await promisePool.query('SELECT post.*, user.username FROM post LEFT JOIN user ON post.owner_ID = user.ID WHERE post.ID = ?', [id]);
        return rows;
    } catch (e) {
        console.error('postModel getPostByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel getPostByID' });
    }
};

// SELECT all posts by user id
const getPostsByUserID = async (id, res) => {
    try {
        const [rows] = await promisePool.query('SELECT post.*, user.username FROM post LEFT JOIN user ON post.owner_ID = user.ID WHERE post.owner_ID =? ORDER BY time_stamp DESC', [id]);
        return rows;
    } catch (e) {
        console.error('postModel getPostsByUserID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel getPostsByUserID' });
    }
};

// get post prefs food_fact IDs by post ID
const getPostPrefsByID = async (id, res) => {
    try {
        const [rows] = await promisePool.query('SELECT DISTINCT food_fact_ID FROM post_preferences WHERE post_ID=?', [id]);
        return rows;
    } catch (e) {
        console.error('postModel getPostPrefsByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel getPostPrefsByID' });
    }
}

//-----INSERT-----INSERT-----
// insert post data to DB
const addPost = async (postInfo, res) => {
    try {
        const [rows] = await promisePool.query('INSERT INTO post(filename, description, name, owner_ID, area) VALUES (?,?,?,?,?)',
            [postInfo.filename, postInfo.description, postInfo.title, postInfo.ownerID, postInfo.area]);
        return rows.insertId;
    } catch (e) {
        console.error('postModel addPost error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel addPost'});
    }
};

// insert post preferences by post ids
const addPostPreferences = async (prefsToInsert, res) => {
    try {
        // insert post related food fact data to DB
        const [rows] = await promisePool.query('INSERT INTO post_preferences(post_ID, food_fact_ID) VALUES ?',
            [prefsToInsert]);
        return rows.affectedRows;
    } catch (e) {
        console.error('postModel addPostPreferences error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel addPostPreferences'});
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
        console.error('postModel modifyPost error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel modifyPost'});
    }
};

//-----DELETE-----DELETE-----
// delete post by any id this refers to the post ID
const deletePostByID = async (postId, userId, res) => {
    try {
        const [rows] = await promisePool.query('DELETE FROM post WHERE ID = ? AND owner_ID = ?', [postId, userId]);
        console.log('post model delete', rows);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('postModel deletePostByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel deletePostByID' });
    }
};

const deletePostPreferencesByIdCheck = async (postId, userId, res) => {
  try {
      const [rows] = await promisePool.query(
          'DELETE FROM post_preferences WHERE post_ID IN(SELECT ID FROM post WHERE ID = ? AND owner_ID = ?)', [postId, userId]);
      return rows.affectedRows;
  } catch (e) {
      console.error('postModel deletePostPreferencesByIdCheck error', e.message);
      res.status(500).json({ message: 'something went wrong src: postModel deletePostPreferencesByIdCheck' });
  }
}

const deletePostPreferencesById = async (postId, preferenceIds, res) => {
    try {
        const [rows] = await promisePool.query('DELETE FROM post_preferences WHERE post_ID =? AND food_fact_ID IN ?',
            [postId, [preferenceIds]]);
        return rows.affectedRows;
    } catch (e) {
        console.error('postModel deletePostPreferencesById error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel deletePostPreferencesById' });
    }
};
// delete all posts by the user
const deleteAllPostsByUserID = async (user) => {
    try {
        // delete post (that belongs to the user) related food fact notes from DB
        const [rows1] = await promisePool.query(
            'DELETE FROM post_preferences WHERE post_ID IN(SELECT ID FROM post WHERE owner_ID = ?)', [user.ID]);
        console.log('items deleted from post_preferences:', rows1.affectedRows);

        // delete the actual post data from DB
        const [rows] = await promisePool.query('DELETE FROM post WHERE owner_ID = ?', [user.ID]);
        console.log('post model delete', rows);
        return true;
    } catch (e) {
        console.error('postModel deletePostByID error', e.message);
        return false
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
    deletePostPreferencesByIdCheck,
    deletePostPreferencesById,
    deleteAllPostsByUserID,
};