'use strict';

const editPost = document.getElementById('editPostForm');
const allergensUL = document.querySelector('#allergens');
const dietsUL = document.querySelector('#diets');

// Generate the area dropdown options
generateAreaList(area);
generateCheckBoxList(allergensUL,0);
// generate List of diets
generateCheckBoxList(dietsUL,1);

const editPostDivider = (post) => {
    //
    const editArea = document.querySelector('#area');
    const editTitle = document.querySelector('#title');
    const editDescription = document.querySelector('#description');
    //
    editArea.setAttribute('value',`${post.area}`);
    editTitle.setAttribute('value',`${post.name}`);
    editDescription.innerHTML = `${post.description}`;
    //
};


editPost.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const formData = new FormData(editPost);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    console.log("id inside frontEvent:", id)
    formData.append('ID',`${id}`)
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
        console.log('tässä on id ', id);
        const response = await fetch(url + `/post/openedPost/${id}`, fetchOptions);
        const post = await response.json();
        editPostDivider(post);
    } catch (e) {
        console.log(e.message);
    }
};
getPost();