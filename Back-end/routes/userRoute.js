'use strict';
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

//authentication
router.get('/token', userController.checkToken);

//Modifying an account
router.route('/')
.put(userController.user_put);

//Moderator tools/user account self-deletion
router.route('/:id')
.get(userController.user_get_byId)
.delete(userController.user_delete_byId);

//exporting the router
module.exports = router;