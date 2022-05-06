'use strict';

const editPost = document.getElementById('editPostForm');
const allergensUL = document.querySelector('#allergens');
const dietsUL = document.querySelector('#diets');
const sessionUser = JSON.parse(sessionStorage.getItem('user'));
// Generate the area dropdown options
generateAreaListWithPreselect(area, sessionUser.area);

const logout = document.querySelector('#logout-link');
logout.addEventListener('click', evt => {
    logUserOut();
})

// wait for preference data from DB
const waitForPostData = async (post) => {
    // generate List of allergies
    generateCheckBoxListWithPreCheck(allergensUL,0, post.preferences);
    // generate List of diets
    generateCheckBoxListWithPreCheck(dietsUL,1, post.preferences);
}

const editPostDivider = async (post) => {
    //
    const editTitle = document.querySelector('#title');
    const editDescription = document.querySelector('#description');
    //
    console.log(post)
    editTitle.value = post.name;
    editDescription.value = `${post.description}`;
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
    if (json.postEdited) {
        location.href = '../html/yourPosts.html';
    } else {
        alert(json.message);
    }
});

let post = []
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
        const response = await fetch(url + `/post/${id}`, fetchOptions);
        post = await response.json();
        console.log(post)
        console.log(post[0].preferences)
        await waitForPostData(post[0]);
        await editPostDivider(post[0]);
    } catch (e) {
        console.log(e.message);
    }
};
getPost();