'use strict';
// Authors Karoliina M. & Reima N. & Vili M.

const pool = require('../database/db');
const promisePool = pool.promise();

// SELECT all messages from DB
const getAllMessages = async (res) => {
  try {
    const [rows] = await promisePool.query(`SELECT * FROM message`);
    return rows;
  } catch (e) {
    console.error('messageModel getAllMessages', e);
    res.status(500).json({ message: 'something went wrong'});
  }
};

// SELECT the usernames for a conversation (useful for listing different conversations)
const usernameWithConversation = async (id, res) => {
  try {
    const [rows] = await promisePool.query('SELECT user.username AS sender_username, message.sender_ID FROM message LEFT JOIN user ON message.sender_ID = user.ID ' +
      'WHERE message.sender_ID =? OR message.receiver_ID =? UNION SELECT user.username AS receiver_username, message.receiver_ID FROM message ' +
      'LEFT JOIN user ON message.receiver_ID = user.ID WHERE message.sender_ID =? OR message.receiver_ID =?', [id, id, id, id])
    return rows;
  } catch (e) {
    console.error('messageModel usernameWithConversation ', e);
    res.status(500).json({message: 'something went wrong'});
  }
};

// SELECT message data for a conversation
const getConversation = async (userID, mirkkuliID ,res) => {
  try {
    const [rows] = await promisePool.query('SELECT text, time_stamp, sender_ID, user.username AS sender_username, receiver_ID, user.username AS receiver_username ' +
        'FROM message LEFT JOIN user ON message.sender_ID = user.ID AND message.receiver_ID = user.ID ' +
        'WHERE sender_ID =? AND receiver_ID =? OR sender_ID =? AND receiver_ID =?', [userID, mirkkuliID,mirkkuliID ,userID])
    return rows;
  } catch (e) {
    console.error('messageModel getConversation', e);
    res.status(500).json({message: 'something went wrong'});
  }
}

// INSERT a new message to DB
const addMessage = async(message, res) => {
  try {
    console.log(message)
    const [rows] = await promisePool.query('INSERT INTO message(sender_ID, text, receiver_ID, sender_username, receiver_username) VALUES(?, ?, ?, ?, ?)',
        [message.sender_ID, message.text, message.receiver_ID, message.sender_username, message.receiver_username]);
    console.log('message sent in database', rows);
    return rows.insertId;
  } catch (e) {
    console.error('messageModel addMessage error', e.message);
    res.status(500).json({message: 'something went wrong'});
  }
}

module.exports = {
  addMessage,
  getAllMessages,
  usernameWithConversation,
  getConversation,
};