'use strict';

const express = require('express');
const messageController = require('../controllers/messageController');
const passport = require('../utilities/pass');
const router = express.Router();


router.route('/')
.post(messageController.message_post)
    .get(messageController.message_list_get)

router.route('/conversation')
.get(passport.authenticate('jwt', {session: false}), messageController.one_conversation_get);


module.exports = router;