'use strict';

const editPost = document.querySelector('#editPostForm');

editPost.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const formData = new FormData(editPost);
    const posting = {
        method: 'PUT',
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