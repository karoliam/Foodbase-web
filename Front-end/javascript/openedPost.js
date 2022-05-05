'use strict';

const sessionUser = JSON.parse(sessionStorage.getItem('user'));
const messageTextarea = document.querySelector('#contact');
const messageSubmitButton = document.querySelector('#send-button');
const contactForm = document.querySelector('#contact-form');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
const ownerID = urlParams.get('userid');



messageTextarea.addEventListener('input', evt => {
  // Check that sessionUser is found
  if (!sessionUser) {
    location.href = "../html/anonymousUser.html";
  }
})



// Get only the single post according to url 'id' parameter
const getPost = async () => {
  try {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };

    const response = await fetch(url + `/post/${id}`, fetchOptions);
    const post = await response.json();
    //Generate a single post
    const postFeed = document.querySelector('.post-feed');
    await postGenerator(postFeed, post, false, true, false, false);
  } catch (e) {
    console.log(e.message);
  }
};
getPost();
const logoutDiv = document.querySelector('.logout')

//When sending a message it replaces the message box with a box saying Message sent for 5 seconds and then switching it back
const messageSent = document.createElement('p');
const messageSentContainer = document.createElement('div');
//If user is not logged in create Login icon instead of logout
if(!sessionUser) {
  createLoginIcon(logoutDiv);
} else {
  const logout = document.querySelector('#logout-link');
  logout.addEventListener('click', evt => {
    logUserOut();
  })
}

function replaceElement() {
  messageSent.id = 'message-sent';
  messageSentContainer.id = 'message-sent-container';
  messageSent.textContent = 'Message sent!'
  messageSentContainer.appendChild(messageSent);
  contactForm.parentNode.replaceChild(messageSentContainer, contactForm);
}
function replaceBack() {
  messageSentContainer.parentNode.replaceChild(contactForm, messageSentContainer);
}

//sending message to the database
contactForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    await sendMsg(sessionUser, urlParams);
    setTimeout(replaceElement, 500);
    setTimeout(replaceBack, 5000);
});

