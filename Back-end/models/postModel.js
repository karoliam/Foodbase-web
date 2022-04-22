'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

const getAllPosts = async () => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM post');
        return rows;
    } catch (e) {
        console.error('error', e.message);
    }
};

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

const addPost = async (post, res) => {
    try {
        const [rows] = await promisePool.query('INSERT INTO post(filename, description, name) VALUES (?,?,?)', [post.filename, post.description, post.name]);
        console.log('post model insert', rows);
        return rows.insertId;
    } catch (e) {
        console.error('post model addPost error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel addPost'});
        return;
    }
};

const modifyPost = async (post, res) => {
    try {
        const [rows] = await promisePool.query('UPDATE post SET filename = ?, description = ?, name = ? WHERE ID = ?', [post.filename, post.description, post.name, post.ID]);
        console.log('post model update', rows);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('post model modifyPost error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel modifyPost'});
        return;
    }
};

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