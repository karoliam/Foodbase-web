'use strict';

const createPost = document.getElementById('createPost');
const area = document.querySelector('#area');
const allergensUL = document.querySelector('#allergens');
const dietsUL = document.querySelector('#diets');
const sessionUser = JSON.parse(sessionStorage.getItem('user'));

// Check that sessionUser is found
if (!sessionUser) {
  location.href = "../html/anonymousUser.html";
} else {
  // Generate the area dropdown options
  generateAreaListWithPreselect(area, sessionUser.area);
  generateCheckBoxList(allergensUL,0);
// generate List of diets
  generateCheckBoxList(dietsUL,1);



  createPost.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const formData = new FormData(createPost);
    formData.append("ownerID",`${sessionUser.ID}`)
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
}