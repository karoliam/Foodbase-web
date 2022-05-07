'use strict';

const sessionUser = JSON.parse(sessionStorage.getItem('user'));
const article = document.querySelector('#message-article');


if (!sessionUser) {
  location.href = "../html/anonymousUser.html";
} else {
  const getUsernameConversation = async (username) => {
    username.forEach((username) => {
      if(username.sender_username !== sessionUser.username) {
        const usernameTitle = document.createElement('div');
        usernameTitle.className = 'username-time';

        const conversationLink = document.createElement('a');
        conversationLink.className = 'message-link';

        conversationLink.href = `messageThread.html?userid=${username.sender_ID}&user=${username.sender_username}`;
        console.log(conversationLink.href);
        const messageUsername = document.createElement('p');
        const box = document.createElement('div');
        box.className = 'message-thread';
        messageUsername.id = username.sender_username;
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
      //Here we generate the posts
      await getUsernameConversation(username);
    } catch (e) {
      console.log(e.message);
    }
  };
  // Initially at page load if user not logged in
  getUsername();
}
