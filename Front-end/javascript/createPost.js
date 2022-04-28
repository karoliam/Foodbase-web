'use strict';

const createPost = document.getElementById('createPost');

createPost.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const formData = new FormData(createPost);
  const posting = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    body: formData,
  };
  const response = await fetch(url + '/post', posting);
  const json = await response.json();
  alert(json.message);
  location.href = '../html/feed.html';
});