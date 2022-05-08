'use strict';

const sessionUser = JSON.parse(sessionStorage.getItem('user'));
const article = document.querySelector('#message-article');


if (!sessionUser) {
  location.href = "../html/anonymousUser.html";
} else {
  const getUsernameConversation = async (username) => {
    username.forEach((username) => {
      if(username.sender_username !== sessionUser.username) {

        //creating a button for conversations
        const usernameTitle = document.createElement('div');
        usernameTitle.className = 'username-time';
        const conversationLink = document.createElement('a');
        const box = document.createElement('div');
        box.className = 'message-thread';
        conversationLink.className = 'message-link';
        conversationLink.href = `messageThread.html?userid=${username.sender_ID}`;

        //adding username for the button
        const messageUsername = document.createElement('p');
        messageUsername.id = username.sender_ID;
        messageUsername.textContent = username.sender_username;

        box.appendChild(messageUsername);
        usernameTitle.appendChild(box);
        conversationLink.appendChild(usernameTitle);
        article.appendChild(conversationLink);
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
      const response = await fetch(url + '/message/username', fetchOptions);
      const username = await response.json();
      console.log(username);
      //Here we generate the conversations
      await getUsernameConversation(username);
    } catch (e) {
      console.log(e.message);
    }
  };
  getUsername();
}
