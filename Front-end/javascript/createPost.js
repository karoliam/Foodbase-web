'use strict';

const createPost = document.getElementById('createPost');
const area = document.querySelector('#area');
const allergensUL = document.querySelector('#allergens');
const dietsUL = document.querySelector('#diets');

// Generate the area dropdown options
generateAreaList(area);



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