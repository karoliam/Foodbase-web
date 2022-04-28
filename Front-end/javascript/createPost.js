'use strict';

const createPost = document.querySelector('#createPostForm');

createPost.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const formData = new FormData(createPost);
    const loginObj=JSON.parse(sessionStorage.getItem('user'));
    formData.append("ownerID", `${loginObj.ID}`)
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