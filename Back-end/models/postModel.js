'use strict';
// Authors Vili M. & Reima N.

const pool = require('../database/db');
const promisePool = pool.promise();

// -----SELECT-----SELECT-----
// SELECT all posts from DB and JOIN username to the post
const getAllPosts = async (res) => {
    try {
        const [rows] = await promisePool.query('SELECT post.*, user.username FROM post LEFT JOIN user ON post.owner_ID = user.ID ORDER BY time_stamp DESC');
        return rows;
    } catch (e) {
        console.error('postModel getAllPosts error', e.message);
        res.status(500).json({ message: 'something went wrong' });
    }
};

// SELECT single post by id from DB and JOIN username to the post
const getPostByID = async (id, res) => {
    try {
        const [rows] = await promisePool.query('SELECT post.*, user.username FROM post LEFT JOIN user ON post.owner_ID = user.ID WHERE post.ID = ?', [id]);
        return rows;
    } catch (e) {
        console.error('postModel getPostByID error', e.message);
        res.status(500).json({ message: 'something went wrong' });
    }
};

// SELECT all posts by id and JOIN username to the post
const getPostsByUserID = async (id, res) => {
    try {
        const [rows] = await promisePool.query('SELECT post.*, user.username FROM post LEFT JOIN user ON post.owner_ID = user.ID WHERE post.owner_ID =? ORDER BY time_stamp DESC', [id]);
        return rows;
    } catch (e) {
        console.error('postModel getPostsByUserID error', e.message);
        res.status(500).json({ message: 'something went wrong' });
    }
};

// SELECT all post_preferences food_fact ids by id
const getPostPrefsByID = async (id, res) => {
    try {
        const [rows] = await promisePool.query('SELECT DISTINCT food_fact_ID FROM post_preferences WHERE post_ID=?', [id]);
        return rows;
    } catch (e) {
        console.error('postModel getPostPrefsByID error', e.message);
        res.status(500).json({ message: 'something went wrong' });
    }
}

// get all post reports
const getAllPostReports = async () => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM post_reports');
        return rows;
    } catch (e) {
        console.error('postModel getAllPostreports error', e.message);
    }
}

// SELECT all post report by id
const getPostReportsByID = async (id) => {
    try {
        const [rows] = await promisePool.query('SELECT post_ID, reason FROM post_reports WHERE post_ID=?', [id]);
        return rows;
    } catch (e) {
        console.error('postModel getPostReportsByID error', e.message);
    }
}

//-----INSERT-----INSERT-----
// INSERT post's main data to DB
const addPost = async (postInfo, res) => {
    try {
        const [rows] = await promisePool.query('INSERT INTO post(filename, description, name, owner_ID, area) VALUES (?,?,?,?,?)',
            [postInfo.filename, postInfo.description, postInfo.title, postInfo.ownerID, postInfo.area]);
        return rows.insertId;
    } catch (e) {
        console.error('postModel addPost error', e.message);
        res.status(500).json({ message: 'something went wrong'});
    }
};

// INSERT post preferences by a set of id's
const addPostPreferences = async (prefsToInsert, res) => {
    try {
        const [rows] = await promisePool.query('INSERT INTO post_preferences(post_ID, food_fact_ID) VALUES ?',
            [prefsToInsert]);
        return rows.affectedRows;
    } catch (e) {
        console.error('postModel addPostPreferences error', e.message);
        res.status(500).json({ message: 'something went wrong'});
    }
}

// INSERT post report data to DB
const addNewReport = async (reason, id) => {
    try {
        const [rows] = await promisePool.query('INSERT INTO post_reports(reason, post_ID) VALUES(?,?)',
            [reason, id]);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('postModel addNewReport error', e.message);
    }
}

//-----SET-----SET-----
// UPDATE existing post's main data
const modifyPost = async (postInfo, res) => {
    try {
        const [rows] = await promisePool.query('UPDATE post SET filename=?, description=?, name=?, area=? WHERE ID = ?',
            [postInfo.filename, postInfo.description, postInfo.title, postInfo.area, postInfo.ID]);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('postModel modifyPost error', e.message);
        res.status(500).json({ message: 'something went wrong'});
    }
};

//-----DELETE-----DELETE-----
// delete post by it's id and owner id
const deletePostByID = async (postId, userId, res) => {
    try {
        const [rows] = await promisePool.query('DELETE FROM post WHERE ID = ? AND owner_ID = ?', [postId, userId]);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('postModel deletePostByID error', e.message);
        res.status(500).json({ message: 'something went wrong' });
    }
};

// delete post preference with post id & user id
const deletePostPreferencesByIdCheck = async (postId, userId, res) => {
  try {
      const [rows] = await promisePool.query(
          'DELETE FROM post_preferences WHERE post_ID IN(SELECT ID FROM post WHERE ID = ? AND owner_ID = ?)', [postId, userId]);
      return rows.affectedRows;
  } catch (e) {
      console.error('postModel deletePostPreferencesByIdCheck error', e.message);
      res.status(500).json({ message: 'something went wrong' });
  }
}

// delete post preference post id & an array of food fact ids
const deletePostPreferencesById = async (postId, foodFactIds, res) => {
    try {
        const [rows] = await promisePool.query('DELETE FROM post_preferences WHERE post_ID =? AND food_fact_ID IN ?',
            [postId, [foodFactIds]]);
        return rows.affectedRows;
    } catch (e) {
        console.error('postModel deletePostPreferencesById error', e.message);
        res.status(500).json({ message: 'something went wrong' });
    }
};

// delete all post preferences from user's posts by user id
const deleteAllPostsPreferencesByUserID = async (userId, res) => {
    try {
        const [rows] = await promisePool.query('DELETE FROM post_preferences WHERE post_ID IN(SELECT ID FROM post WHERE owner_ID = ?)', [userId]);
        console.log(rows)
        return rows.affectedRows;
    } catch (e) {
        console.error('postModel deleteAllPostsPreferencesByUserID error', e.message);
        res.status(500).json({});
        return 0;
    }
}
// delete all posts by the user
const deleteAllPostsByUserID = async (userId, res) => {
    try {
        const [rows] = await promisePool.query('DELETE FROM post WHERE owner_ID = ?', [userId]);
        console.log('postModel delete', rows);
        return true;
    } catch (e) {
        console.error('postModel deleteAllPostsByUserID error', e.message);
        res.status(500).json({});
        return false;
    }
};

// delete all reports from a post
const deletePostReportsByID = async (postID) => {
    try {
        const [rows] = await promisePool.query('DELETE FROM post_reports WHERE post_ID = ?', [postID]);
        console.log('postModel delete reports', rows);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('postModel deleteAllPostsByUserID error', e.message);
        return false;
    }
}

// delete all reports from all posts of a user
const deleteAllPostReportsByUserID = async (userID) => {
    try {
        const [rows] = await promisePool.query('DELETE FROM post_reports WHERE post_ID IN(SELECT ID from post where owner_ID = ?)', [userID]);
        console.log('postModel delete reports', rows);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('postModel deleteAllPostsByUserID error', e.message);
        return false;
    }
}

module.exports = {
    getAllPosts,
    getPostByID,
    getPostsByUserID,
    getPostPrefsByID,
    getAllPostReports,
    getPostReportsByID,
    addPost,
    addPostPreferences,
    addNewReport,
    modifyPost,
    deletePostByID,
    deletePostPreferencesByIdCheck,
    deletePostPreferencesById,
    deleteAllPostsByUserID,
    deleteAllPostsPreferencesByUserID,
    deletePostReportsByID,
    deleteAllPostReportsByUserID,
};