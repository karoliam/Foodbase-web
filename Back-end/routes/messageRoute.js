'use strict';

const express = require('express');
const messageController = require('../controllers/messageController');
const router = express.Router();


router.route('/')
.post(messageController.message_post)
    .get(messageController.message_list_get)

router.route('/username')
.get(messageController.username_conversation_get);

router.route('/conversation/:id')
    .get(messageController.conversation_messages_get);

module.exports = router;