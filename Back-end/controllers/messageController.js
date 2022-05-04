'use strict';

const messageModel = require('../models/messageModel')


const message_list_get = async (req, res) => {
  console.log('tämä route')
  const allMessages = await messageModel.getAllMessages(res);
  res.json(allMessages);
};

const one_conversation_get = async (req, res) => {
  console.log('tässä on req.user.id', req.user.ID);
  const receiverId = await messageModel.oneConversation(req.user.ID);
  res.json(receiverId);
}

const message_post = async (req, res) => {
  console.log('message controller post body',  req.body);
  const message = req.body;
  console.log('message uploaded', message);
  const id = await messageModel.addMessage(message, res);
  res.json({message: `message created with ${id}.`});
};


module.exports = {
  message_post,
  message_list_get,
  one_conversation_get,
}