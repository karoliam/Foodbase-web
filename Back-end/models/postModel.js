'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllPosts = async () => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM post ORDER BY time_stamp DESC');
        return rows;
    } catch (e) {
        console.error('error', e.message);
    }
};
// GET post by number that is passed to id
const getPostByID = async (id, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM post WHERE ID = ?', [id]);
        return rows[0];
    } catch (e) {
        console.error('post, post model getPostByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel getPost' });
        return;
    }
};
// create new post
const addPost = async (post,file, res) => {
    try {
        // TODO add food_fact relations to post in post_to_food_fact table
        const [rows] = await promisePool.query('INSERT INTO post(filename, description, name, owner_ID, area) VALUES (?,?,?,?,?)',
            [file.filename, post.description, post.title, post.owner_ID, post.area]);
        console.log('post model insert', rows);
        // delete non-preferneces from post
        delete post.filename;
        delete post.description;
        delete post.title;
        delete post.owner_ID;
        delete post.area;
        /*for (const prefs in post) {
            // TODO this will change according to post contents
            const [rows1] = await promisePool.query('INSERT INTO post_to_food_fact(post_ID, food_fact_ID) VALUES (?,?)',
                [rows.insertId, post[prefs]]);
            console.log("post food_fact note created with id:",rows1.insertId)
        }*/
        return rows.insertId;
    } catch (e) {
        console.error('post model addPost error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel addPost'});
        return;
    }
};
// modify existing post
const modifyPost = async (post, res) => {
    try {
        // TODO modify food_fact relations to post in post_to_food_fact table
        const [rows] = await promisePool.query('UPDATE post SET filename = ?, description = ?, name = ? WHERE ID = ?', [post.filename, post.description, post.name, post.ID]);
        console.log('post model update', rows);
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