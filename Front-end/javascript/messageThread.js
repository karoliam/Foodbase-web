'use strict';

const sessionUser = JSON.parse(sessionStorage.getItem('user'));
const chatContainer = document.getElementById('chat-container');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userID = urlParams.get('id');
const userName = urlParams.get('username');
const contactForm = document.querySelector('#contact-form');

// Check that sessionUser is found
if (!sessionUser) {
  location.href = "../html/anonymousUser.html";
} else {
  const logout = document.querySelector('#logout-link');
  logout.addEventListener('click', evt => {
    logUserOut();
  })

  const getConversation = async (message) => {
    message.forEach((message) => {

      const messageContainerSent = document.createElement('div');
      messageContainerSent.className = 'message-container-sent';

      const messageContainerReceived = document.createElement('div');
      messageContainerReceived.className = 'message-container-received';

      const receivedMessage = document.createElement('p');
      const sentMessage = document.createElement('p');
      receivedMessage.className = 'received';
      sentMessage.className = 'sent';


      const receiverUsername = document.createElement('p');
      const timeStampReceiver = document.createElement('p');
      const timeStampSender = document.createElement('p');

      receiverUsername.className = 'receiver-username';
      timeStampReceiver.className = 'timestamp-receiver';
      timeStampSender.className = 'timestamp-sender';

      const senderUsername = document.createElement('p');
      senderUsername.className = 'sender-username';


      const time = new Date(message.time_stamp).toLocaleTimeString('fi-FI',
          { timeStyle: 'short', hour12: false});

      //received message
      if(message.receiver_ID === sessionUser.ID) {
        receiverUsername.textContent = message.sender_username;
        receivedMessage.textContent = message.text;
        timeStampSender.textContent = time;
        messageContainerSent.appendChild(receiverUsername);
        messageContainerSent.appendChild(receivedMessage);
        messageContainerSent.appendChild(timeStampSender);
        chatContainer.appendChild(messageContainerSent);
      } //sent message
      else if(message.sender_ID === sessionUser.ID) {
        senderUsername.textContent = message.sender_username;
        sentMessage.textContent = message.text;
        timeStampReceiver.textContent = time;
        messageContainerReceived.appendChild(senderUsername);
        messageContainerReceived.appendChild(sentMessage);
        messageContainerReceived.appendChild(timeStampReceiver);
        chatContainer.appendChild(messageContainerReceived);
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
      const response = await fetch(url + `/message/conversation/${userID}`, fetchOptions);
      const message = await response.json();
      chatContainer.innerHTML = '';
      //here we generate the messages
      await getConversation(message);
    } catch (e) {
      console.log(e.message);
    }
  };
  getMessages();
  // Initially at page load if user not logged in
}
contactForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  await sendMsg(sessionUser, urlParams);
});
