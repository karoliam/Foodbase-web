'use strict';

const sendMsg = async (sessionUser, urlParams) => {
  const id = urlParams.get('userid');
  const receiverUsername = urlParams.get('user');
  const messageField = document.querySelector('#contact');
  console.log('session user', sessionUser.username, 'receiver username', receiverUsername);

    console.log(sessionUser.ID, messageField.value.toString(), id);
    const messageDataJson = {
      "sender_ID": sessionUser.ID,
      "text": messageField.value.toString(),
      "receiver_ID": id,
      "sender_username": sessionUser.username,
      "receiver_username": receiverUsername,
    };
    console.log('messagedatajson', messageDataJson);
    const messageToDb = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify(messageDataJson),
    };
    const response = await fetch(url + '/message', messageToDb);
    console.log(response);
    const json = await response.json();
    alert(json.message);
    messageField.value = '';

}
