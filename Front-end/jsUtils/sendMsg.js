'use strict';

const sendMsg = async (sessionUser, urlParams) => {
  const id = urlParams.get('userid');
  const messageField = document.querySelector('#contact');


    const messageDataJson = {
      "sender_ID": sessionUser.ID,
      "text": messageField.value.toString(),
      "receiver_ID": id,
    };
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
    await response.json();
    messageField.value = '';
}
