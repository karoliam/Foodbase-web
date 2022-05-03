'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const addMessage = async(message, res) => {
  try {
    console.log(message)
    const [rows] = await promisePool.query('INSERT INTO message(sender_ID, text, receiver_ID) VALUES(?, ?, ?)',
        [message.sender_ID, message.text, message.receiver_ID]);
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
};