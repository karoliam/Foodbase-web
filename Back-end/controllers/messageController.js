'use strict';

const messageModel = require('../models/messageModel')


const message_list_get = async (req, res) => {
  const allMessages = await messageModel.getAllMessages(res);
  res.json(allMessages);
};

const username_conversation_get = async (req, res) => {
  console.log('tässä on req.user.id', req.user.ID);
  const receiverId = await messageModel.usernameWithConversation(req.user.ID);
  res.json(receiverId);
}

const conversation_messages_get = async (req, res) => {
  const oneConversation = await messageModel.getConversation(req.user.ID, req.params.id);
  res.json(oneConversation);
}

const message_post = async (req, res) => {
  console.log('message controller post body',  req.body);
  const message = req.body;
  console.log('message uploaded', message);
  const id = await messageModel.addMessage(message, res);
  res.json({message: `${id}:Message sent!`});
};


module.exports = {
  message_post,
  message_list_get,
  username_conversation_get,
  conversation_messages_get,
}