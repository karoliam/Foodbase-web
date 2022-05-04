'use strict';

const messageThread = document.getElementById('message-thread');
const sessionUser = JSON.parse(sessionStorage.getItem('user'));
const usernameTitle = document.getElementById('username-time');


if (!sessionUser) {
  location.href = "../html/anonymousUser.html";
} else {

  const getUsernameConversation = async (conversation) => {
    conversation.forEach((conversation) => {

      if(conversation.sender_username !== sessionUser.username) {
        console.log('täällä', conversation.sender_username);
        const messageUsername = document.createElement('p');
        const box = document.createElement('div');
        box.id = 'message-thread';
        messageUsername.id = conversation.sender_username;
        messageUsername.textContent = conversation.sender_username;
          box.appendChild(messageUsername);
          usernameTitle.appendChild(box);
      }
    })
  };

  const getUsername = async () => {
    try {
      const fetchOptions = {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const response = await fetch(url + '/message/conversation', fetchOptions);
      const username = await response.json();
      console.log(username);
      //Here we generate the posts
      await getUsernameConversation(username);
    } catch (e) {
      console.log(e.message);
    }
  };
  // Initially at page load if user not logged in
  getUsername();
}
