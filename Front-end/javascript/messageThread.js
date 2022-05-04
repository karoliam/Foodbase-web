'use strict';

const sessionUser = JSON.parse(sessionStorage.getItem('user'));
const chatContainer = document.getElementById('chat-container');

// Check that sessionUser is found
if (!sessionUser) {
  location.href = "../html/anonymousUser.html";
} else {
  const getMsg = async (message) => {
    message.forEach((message) => {

      const receivedMessage = document.createElement('p');
      const sentMessage = document.createElement('p');
      receivedMessage.className = 'received';
      sentMessage.className = 'sent';
      //received message
      if(message.receiver_ID === sessionUser.ID) {
        receivedMessage.textContent = ` ${message.sender_username}: ${message.text};`
        chatContainer.appendChild(receivedMessage);
      } //sent message
      else if(message.sender_ID === sessionUser.ID) {
        sentMessage.textContent = `${message.sender_username}: ${message.text}`
        chatContainer.appendChild(sentMessage);
      }
})
  };
  const getMessages = async () => {
    try {
      const fetchOptions = {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const response = await fetch(url + '/message', fetchOptions);
      const message = await response.json();
      //Here we generate the posts
      await getMsg(message);
    } catch (e) {
      console.log(e.message);
    }
  };
  // Initially at page load if user not logged in
  getMessages();
}

