'use strict';

// TODO: Messaging. Currently only checks that user is logged in.
const sessionUser = JSON.parse(sessionStorage.getItem('user'));
const messageTextarea = document.querySelector('#contact');
const messageSubmitButton = document.querySelector('#send-button');

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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    const response = await fetch(url + `/post/openedPost/${id}`, fetchOptions);
    const post = await response.json();
    //Generate a single post
    const postFeed = document.querySelector('.post-feed');
    await postGenerator(postFeed, [post], false);
  } catch (e) {
    console.log(e.message);
  }
};
getPost();
