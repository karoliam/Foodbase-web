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

// On form submit
searchBar.addEventListener('submit', evt =>  {
  const searchForm = new FormData(searchBar);
  // Start but don't await the asynchronous function to prevent UI sluggishness
  sortArticlesBySearchTerms(searchForm);
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
      await postGenerator(postFeed, posts, false);
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
    logUserOut(sessionUser);
  })

  // TODO: Remove this call to generate all posts
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
      await postGenerator(postFeed, posts, false);
    } catch (e) {
      console.log(e.message);
    }
  };
  // Initially at page load if user not logged in
  getAllPosts();


  // TODO: Get and generate all user preference matching posts

}