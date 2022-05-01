'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllPosts = async () => {
    try {
        const [rows] = await promisePool.query('SELECT post.*, user.username FROM post LEFT JOIN user ON post.owner_ID = user.ID ORDER BY time_stamp DESC');
        return rows;
    } catch (e) {
        console.error('error', e.message);
    }
};
// GET post by number that is passed to id
const getPostByID = async (id, res) => {
    try {
        const [rows] = await promisePool.query('SELECT post.*, user.username FROM post LEFT JOIN user ON post.owner_ID = user.ID WHERE post.ID = ?', [id]);
        return rows[0];
    } catch (e) {
        console.error('post, post model getPostByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel getPost' });
        return;
    }
};
// create new post
const addPost = async (postInfo, prefs, res) => {
    try {

        // insert the base post data to DB
        const [rows] = await promisePool.query('INSERT INTO post(filename, description, name, owner_ID, area) VALUES (?,?,?,?,?)',
            [postInfo.filename, postInfo.description, postInfo.title, postInfo.ownerID, postInfo.area]);
        console.log('post model insert', rows);

        // insert post related food fact data to DB
        for (const prefID in prefs) {
            const [rows1] = await promisePool.query('INSERT INTO post_to_food_fact(post_ID, food_fact_ID) VALUES (?,?)',
                [rows.insertId, prefs[prefID]]);
            console.log("post food_fact note created with id:",rows1.insertId)
        }
        return rows.insertId;
    } catch (e) {
        console.error('post model addPost error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel addPost'});
        return;
    }
};
// modify existing post
const modifyPost = async (postInfo, newPrefs, res) => {
    // TODO this fine piece of work has to be ctrl + c and ctrl + v to every relevant function
    try {
        let prefsToDelete = [];
        let prefsToInsert = [];
        const oldPrefs = [];
        // check the preferences in DB with post ID
        const oldRows = await getPostPrefsByID(postInfo.ID, res);
        for (const rowKey in oldRows) {
            oldPrefs.push(oldRows[rowKey].food_fact_ID);
        }
            // no loop if no preferences existed in DB
            if (oldPrefs.length !== 0) { for (let i = 0; i < newPrefs.length; i++) {
                // check for new preferences to add, we can't add duplicates
                    if (!oldPrefs.includes(newPrefs[i])) { prefsToInsert.push([postInfo.ID, newPrefs[i]]); }
                }
            } else { for (let i = 0; i < newPrefs.length; i++) {
                        prefsToInsert.push([postInfo.ID, newPrefs[i]]);
                    }
            }
            // no loop if no preferences were ticked in edit form
            if (newPrefs.length !== 0) { for (let i = 0; i < oldPrefs.length; i++) {
                    // check what preferences don't exist in the new set
                    if (!newPrefs.includes(oldPrefs[i])) { prefsToDelete.push(oldPrefs[i]); }
                }
            } else { prefsToDelete = prefsToDelete.concat(oldPrefs); }
            // if no preferences exist in DB there's nothing to delete
            if (oldPrefs.length !== 0) {
            const [delRows] = await promisePool.query('DELETE FROM post_to_food_fact WHERE post_ID =? AND food_fact_ID =?',
                [postInfo.ID,prefsToDelete]);
                console.log("post foodfact notes deleted: ", delRows.affectedRows)
            }
            // if no preferences were ticked in Form there is nothing to add
            if (newPrefs.length !== 0) {
                    const [addRows] = await promisePool.query('INSERT INTO post_to_food_fact(post_ID, food_fact_ID) VALUES ?',
                        [prefsToInsert]);
                    console.log("new post foodfact notes added: ", addRows.affectedRows);
            }
            // TODO I'm just a helpful todo marker for Vili's copy pasting
        // update post's main data to DB
        const [rows] = await promisePool.query('UPDATE post SET filename=?, description=?, name=?, area=? WHERE ID = ?',
            [postInfo.filename, postInfo.description, postInfo.title, postInfo.area, postInfo.ID]);
        console.log('postModel updated post info:', rows);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('post model modifyPost error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel modifyPost'});
        return;
    }
};
// delete post by any id this refers to the post ID
const deletePostByID = async (id, res) => {
    try {
        // delete post related food fact notes from DB
        const [rows1] = await promisePool.query('DELETE FROM post_to_food_fact WHERE post_ID=?', [id])
        console.log('items deleted from post_to_food_fact:', rows1.affectedRows);

        // delete the actual post data from DB
        const [rows] = await promisePool.query('DELETE FROM post WHERE ID = ?', [id]);
        console.log('post model delete', rows);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('postModel deletePostByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel deletePostByID' });
        return;
    }
};
// get posts by user ID (your posts needs this)
const getPostsByUserID = async (id, res) => {
    try {
        // Select all posts from DB where post owner ID = logged in users id
        const [rows] = await promisePool.query('SELECT post.*, user.username FROM post LEFT JOIN user ON post.owner_ID = user.ID WHERE post.owner_ID =? ORDER BY time_stamp DESC', [id]);
        console.log('postModel posts GET with owner_ID:' , id);
        return rows;
    } catch (e) {
        console.error('postModel getPostsByUserID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel getPostsByUserID' });
        return;
    }
};
// get post prefs food_fact IDs by post ID
const getPostPrefsByID = async (id, res) => {
    try {
        const [rows] = await promisePool.query('SELECT DISTINCT food_fact_ID FROM post_to_food_fact WHERE post_ID=?', [id]);
        return rows;
    } catch (e) {
        console.error('postModel getPostPrefsByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel getPostPrefsByID' });
        return;
    }
}

module.exports = {
    getAllPosts,
    getPostByID,
    addPost,
    modifyPost,
    deletePostByID,
    getPostsByUserID,
    getPostPrefsByID,
};