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
const addPost = async (post,file,user_ID, res) => {
    try {
        // TODO add food_fact relations to post in post_to_food_fact table
        const [rows] = await promisePool.query('INSERT INTO post(filename, description, name, owner_ID, area) VALUES (?,?,?,?,?)',
            [file.filename, post.description, post.title, post.user_ID, post.area]);
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
const modifyPost = async (post,postFacts, res) => {
    try {
        const [rows1] = await promisePool.query('DELETE FROM post_to_food_fact WHERE post_ID =?', [post.ID]);
        console.log('preferences deleted:', rows1.affectedRows);
        const [rows] = await promisePool.query('UPDATE post SET filename =?, description =?, name =?, area=? WHERE ID = ?',
            [post.filename, post.description, post.name,post.area, post.ID]);
        // Looping through the preferences
        for (const pref in postFacts) {
            // Number to be inserted as the food_fact_ID
            let prefNumber;
            if (lists.allergenList.includes(pref)) {
                prefNumber = lists.allergenList.indexOf(pref) + 1;
            }
            if (lists.dietList.includes(pref)) {
                //Same deal but with the addition of the allergenLists' length
                prefNumber = lists.allergenList.length + lists.dietList.indexOf(pref) + 1;
            }
            const [rows2] = await promisePool.query('INSERT INTO post_to_food_fact(post_ID, food_fact_ID) VALUES (?,?)',
                [rows.insertId, prefNumber]);
            console.log("preference created with id:",rows2.insertId);
        }
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
        const [rows1] = await promisePool.query('DELETE FROM post_to_food_fact WHERE post_ID =?', [id]);
        console.log('preferences deleted:', rows1.affectedRows)
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('user model deleteUserByID error', e.message);
        res.status(500).json({ message: 'something went wrong src: postModel deletePostByID' });
        return;
    }

};

const getPostFoodFactsByID = async (id,res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM post_to_food_fact WHERE ID = ?', [id]);
        return rows;
    } catch (e) {
        console.error('post, post model getPostByID error', e.message);
        res.status(500).json({message: 'something went wrong src: postModel getPost'});
        return;
    }
};
module.exports = {
    getAllPosts,
    getPostByID,
    addPost,
    modifyPost,
    deletePostByID,
    getPostFoodFactsByID,
};