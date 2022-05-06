'use strict';

//------Preparations----------------------------------------------------------
const logout = document.querySelector('#logout-link');
const sessionUser = JSON.parse(sessionStorage.getItem('user'));
// Moderator Tools link
// If the user is a moderator make the links smaller
if (sessionUser.role === 0) {
    const linkList = document.querySelector('.profile-links');
    linkList.style.fontSize = '0.7em';
} else {
    const moderatorToolsLink = document.querySelector('#moderator-tools-link');
    moderatorToolsLink.style.display = 'none';
}

// Logout functionality
logout.addEventListener('click', evt => {
    logUserOut();
})

//------Get user's posts by user ID---------------------------------------------
const getYourPosts = async () => {
    try {
        const fetchOptions = {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const id = sessionUser.ID;
        const response = await fetch(url + `/post/yourPosts/${id}`, fetchOptions);
        const posts = await response.json();

        //Generate your posts with no links in images
        const postFeed = document.querySelector('.post-feed');
        postGenerator(postFeed,posts,false, false, true, false);
    } catch (e) {
        console.log(e.message);
    }
};
getYourPosts();
