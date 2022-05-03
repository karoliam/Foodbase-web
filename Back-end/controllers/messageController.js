const messageModel = require('../models/messageModel')

const message_post = async (req, res) => {
  console.log('message controller post body',  req.body);
  const message = req.body;
  console.log('message uploaded', message);
  const id = await messageModel.addMessage(message, res);
  res.json({message: `message created with ${id}.`});
};


module.exports = {
  message_post,
}