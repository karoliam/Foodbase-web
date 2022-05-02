'use strict';

// Logout functionality
const sessionUser = JSON.parse(sessionStorage.getItem('user'));
const logout = document.querySelector('#logout-link');
logout.addEventListener('click', evt => {
    logUserOut(sessionUser);
})

// Get user's posts by user ID
const getYourPosts = async () => {
    try {
        const fetchOptions = {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const userData=JSON.parse(sessionStorage.getItem('user'));
        const id = userData.ID;
        const response = await fetch(url + `/post/yourPosts/${id}`, fetchOptions);
        const posts = await response.json();

        //Generate your posts with no links in images
        const postFeed = document.querySelector('.post-feed');
        postGenerator(postFeed,posts,false);
    } catch (e) {
        console.log(e.message);
    }
};
getYourPosts();
