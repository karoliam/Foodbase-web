'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllMessages = async (res) => {
  try {
    const [rows] = await promisePool.query(`SELECT * FROM message`);
    return rows;
  } catch (e) {
    console.error('messageModel getAllMessages', e);
    res.status(500).json({ message: 'something went wrong'});
  }
};

const usernameWithConversation = async (id, res) => {
  try {
    const[rows] = await promisePool.query(`SELECT sender_username FROM message WHERE sender_ID = ? OR receiver_ID = ? UNION SELECT receiver_username FROM message WHERE sender_ID = ? OR receiver_ID = ?`,
        [id, id, id, id]);
    return rows;
  } catch (e) {
    console.error('messageModel usernameWithConversation ', e);
    res.status(500).json({message: 'something went wrong'});
  }
};

const getConversation = async (userID, mirkkuliID ,res) => {
  try {
    const[rows] = await promisePool.query(`SELECT text, time_stamp FROM message WHERE sender_ID = ? AND receiver_ID = ? OR sender_ID = ? AND receiver_ID = ?  `,
        [userID, mirkkuliID,mirkkuliID ,userID]);
    return rows;
  } catch (e) {
    console.error('messageModel getConversation', e);
    res.status(500).json({message: 'something went wrong'});
  }
}

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
    return;
  }
}




module.exports = {
  addMessage,
  getAllMessages,
  oneConversation: usernameWithConversation,
};