'use strict';

// TODO: Messaging. Currently only checks that user is logged in.
const sessionUser = JSON.parse(sessionStorage.getItem('user'));
const messageTextarea = document.querySelector('#contact');
const messageSubmitButton = document.querySelector('#send-button');
const contactForm = document.querySelector('#contact-form');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');

messageTextarea.addEventListener('input', evt => {
  // Check that sessionUser is found
  if (!sessionUser) {
    location.href = "../html/anonymousUser.html";
  }
})

messageSubmitButton.addEventListener('click', evt => {
  // Check that sessionUser is found
  if (!sessionUser) {
    location.href = "../html/anonymousUser.html";
  } else {
    // TODO: The messaging functionality
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

    const response = await fetch(url + `/post/openedPost/${id}`, fetchOptions);
    const post = await response.json();
    //Generate a single post
    const postFeed = document.querySelector('.post-feed');
    await postGenerator(postFeed, post, false, false);
  } catch (e) {
    console.log(e.message);
  }
};
getPost();

const messageField = document.querySelector("#contact");

contactForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  console.log(sessionUser.ID, messageField.value.toString(), id);
  const messageDataJson = {
    "sender_ID": sessionUser.ID,
    "text": messageField.value.toString(),
    "receiver_ID": id
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
  messageTextarea.value = '';
});