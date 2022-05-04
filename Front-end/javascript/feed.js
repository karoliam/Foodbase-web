'use strict';

// Select most important stuff
const logout = document.querySelector('#logout-link');
const logoutLi = document.querySelector('.logout');
const sessionPreferences = JSON.parse(sessionStorage.getItem('preferences'));
const sessionUser = JSON.parse(sessionStorage.getItem('user'));

//------Functionality for searchBar---------------------------------------------
const allergensDiv = document.querySelector('#allergens');
const dietsDiv = document.querySelector('#diets');
const searchBar = document.querySelector('#search-bar')

// Visual search slide-in
function showSearch() {
  searchBar.style.display = 'block';
}

// Function for generating filtered posts
const generateFilteredPosts = async () => {
  try {
    const fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: sessionStorage.getItem('preferences'),
    };
    const response = await fetch(url + '/post/search', fetchOptions);
    const posts = await response.json();
    //Here we generate the posts
    await postGenerator(postFeed, posts, true, true, false);
  } catch (e) {
    console.log(e.message);
  }
}

// On form submit
searchBar.addEventListener('submit', evt =>  {
  const searchForm = new FormData(searchBar);
  // Start but don't await the asynchronous function to prevent UI sluggishness

  searchArticlesBySearchTerms(searchForm);
})


//------Test if user is logged in and act accordingly---------------------------
if (!sessionUser) {
  // Generate checkbox lists without precheck
  generateCheckBoxList(allergensDiv,0);
  generateCheckBoxList(dietsDiv,1);
  // Hide the logout button
  logoutLi.style.display = 'none';

  // Get and generate all posts to feed
  const postFeed = document.querySelector('.post-feed');
  const getAllPosts = async () => {
    try {
      const fetchOptions = {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const response = await fetch(url + '/post', fetchOptions);
      const posts = await response.json();
      //Here we generate the posts
      await postGenerator(postFeed, posts, true, true, false);
    } catch (e) {
      console.log(e.message);
    }
  };
  // Initially at page load if user not logged in
  getAllPosts();

} else {
  // Generate prechecked checkbox lists
  generateCheckBoxListWithPreCheck(allergensDiv, 0, sessionPreferences);
  generateCheckBoxListWithPreCheck(dietsDiv, 1, sessionPreferences);
  // Logout functionality
  logout.addEventListener('click', evt => {
    logUserOut();
  })

  // TODO: Get and generate all user preference matching posts
  generateFilteredPosts();
}