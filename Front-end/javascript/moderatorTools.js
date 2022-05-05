'use strict';

const sessionUser = JSON.parse(sessionStorage.getItem('user'));

// Get all reported posts
const getReportedPosts = async () => {
  try {
    const fetchOptions = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };

    const response = await fetch(url + `/post/reported`, fetchOptions);
    const reportedPosts = await response.json();
    //Generate all reported posts
    const postFeed = document.querySelector('.post-feed');
    await postGenerator(postFeed, reportedPosts, false, false, false, true);
  } catch (e) {
    console.log(e.message);
  }
};
getReportedPosts();