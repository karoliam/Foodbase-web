'use strict';

const userModel = require('../models/userModel');           //model
//  /user/      GET
const get_users = async (req, res) => {
    const users = await userModel.getAllUsers();
    if (users.length > 0) {
        for (const user of users) {
            delete user.password;
        }
    }
    res.json(users);
};

//  /user/:id   GET
const get_user_by_id = async (req, res) => {
    const user = await userModel.getUserByID(req.params.id, res);
    delete  user.password;
    res.json(user || {});
};

//  /user/      PUT
const modify_user = async (req, res) => {
    console.log('request body');
    console.log(req.body);
    const user = req.body;
    const modified = await userModel.modifyUser(user, res);
    res.json({ message: `user modified successfully: ${modified}.` });
    // res.json(req.params);
    // res.send(`From this endpoint you can modify a user.`);
};

//  /user/      POST
const create_new_user = async (req, res) => {
    console.log('request body');
    console.log(req.body);
    const user = req.body;
    const id = await userModel.addUser(user, res);
    res.json({ message: `user created with id: ${id}.`});
    // res.send(`From this endpoint you can add a user.`);
};

//  /user/      DELETE
const delete_user_by_ID = async (req, res) => {
    console.log('User controller delete by id', req.params.id);
    const del = await userModel.deleteUserByID(req.params.id, res);
    res.json({ message: `user deleted ${del}` });
};

module.exports = {
    get_user_by_id,
    modify_user,
    get_users,
    create_new_user,
    delete_user_by_ID,
}
