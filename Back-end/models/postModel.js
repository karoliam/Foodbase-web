'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllPosts = async () => {
    try {
        const [rows] = await promisePool.query('SELECT post.*, user.username FROM post LEFT JOIN user ON post.owner_ID = user.ID;');
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
const modifyPost = async (postInfo, prefs, testID, res) => {
    try {
        // delete old preferences from DB
        const [rows1] = await promisePool.query('DELETE FROM post_to_food_fact WHERE post_ID =?', [testID]);
        console.log('old preferences deleted from DB:', rows1.affectedRows)
        // update post's main data to DB
        const [rows] = await promisePool.query('UPDATE post SET filename=?, description=?, name=?, area=? WHERE ID = ?',
            [postInfo.filename, postInfo.description, postInfo.title, postInfo.area, testID]);
        console.log('post model update post info:', rows);
        console.log(prefs)
        // insert new post food facts to DB
        for (const prefID in prefs) {
            const [rows2] = await promisePool.query('INSERT INTO post_to_food_fact(post_ID, food_fact_ID) VALUES (?,?)',
        [testID, prefs[prefID]]);
            console.log("post food_fact note created with id:",rows2.insertId)
        }
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('post model modifyPost error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel modifyPost'});
        return;
    }
};
// delete post by req.params.id
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
        console.error('user model deleteUserByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel deletePostByID' });
        return;
    }
};
module.exports = {
    getAllPosts,
    getPostByID,
    addPost,
    modifyPost,
    deletePostByID,
};