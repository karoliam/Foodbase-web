'use strict';

const logout = document.querySelector('#logout-link');
// Search functionality
const allergensDiv = document.querySelector('#allergens');
const dietsDiv = document.querySelector('#diets');
const searchBar = document.querySelector('#search-bar')
const sessionPreferences = JSON.parse(sessionStorage.getItem('preferences'));
const sessionUser = JSON.parse(sessionStorage.getItem('user'));

// Test if user is logged in
if (!sessionUser) {
  // Generate checkbox lists without precheck
  generateCheckBoxList(allergensDiv,0);
  generateCheckBoxList(dietsDiv,1);
  // Hide the logout button
  logout.style.display = 'none';
} else {
  // Generate prechecked checkbox lists
  generateCheckBoxListWithPreCheck(allergensDiv, 0, sessionPreferences);
  generateCheckBoxListWithPreCheck(dietsDiv, 1, sessionPreferences);
  // Logout functionality
  logout.addEventListener('click', evt => {
    logUserOut(sessionUser);
  })
}

// Functionality for searchBar -form
searchBar.addEventListener('submit', evt =>  {
  const searchForm = new FormData(searchBar);
  // Start but don't await the asynchronous function to prevent UI sluggishness
  sortArticlesBySearchTerms(searchForm);
})

// Visual search slide-in
function showSearch() {
  searchBar.style.display = 'block';
}

// Post creation

//select the post-feed
const postFeed = document.querySelector('.post-feed');

//generate the list of posts
const allPosts = (posts) => {
  posts.forEach((post) => {
    //create needed elements, generate their data and add the to postFeed

    //------heading-------------------------------------------------------------
    const headingH6 = document.createElement('h6');
    headingH6.textContent = post.name;
    headingH6.classList.add('post-title');

    //------imageLink and its content (image)-----------------------------------
    const imageLink = document.createElement('a');
    imageLink.href = `openedPost.html?id=${post.ID}`;
    imageLink.classList.add('post-image-link');

    //set image attributes and append to imageLink
    const img = document.createElement('img');
    img.src = url + '/thumbnails/' + post.filename;
    img.alt = post.name;
    img.classList.add('post-image');
    imageLink.appendChild(img);

    //------detailsDiv (under the picture)--------------------------------------
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('details');

    //location and its content (locationIcon)
    const locationP = document.createElement('p');
    locationP.classList.add('location');
    locationP.textContent = post.area;

    //locationIcon
    const locationIcon = document.createElement('i');
    locationIcon.className = "fa-solid fa-location-dot";
    locationP.appendChild(locationIcon);

    //time and date into readable form
    const time = new Date(post.time_stamp).toLocaleTimeString('fi-FI',
        { timeStyle: 'short', hour12: false});
    const date = new Date(post.time_stamp).toLocaleDateString();

    //set time value
    const postTime = document.createElement('p');
    postTime.classList.add('time');
    postTime.textContent = time;

    //set date value
    const postDate = document.createElement('p');
    postDate.classList.add('date');
    postDate.textContent = date;

    // Append elements to detailsDiv
    detailsDiv.appendChild(locationP);
    detailsDiv.appendChild(postDate);
    detailsDiv.appendChild(postTime);

    //------figCaption----------------------------------------------------------
    const figcaption = document.createElement('figcaption');
    figcaption.classList.add('description');

    //username
    const username = document.createElement('p');
    username.classList.add('username');
    username.textContent = post.username;


    //inner description for the figure
    const innerFigDescription = document.createElement('p');
    innerFigDescription.textContent = post.description;
    innerFigDescription.classList.add('descriptionText');

    //flagLink and its content (flagLink)
    const flagLink = document.createElement('a');
    const flagIcon = document.createElement('i');
    flagIcon.className = "fa-solid fa-flag";
    flagLink.appendChild(flagIcon);

    //append elements to figCaption
    figcaption.appendChild(username);
    figcaption.appendChild(innerFigDescription);
    figcaption.appendChild(flagLink);

    //------onePost to contain the generated post-------------------------------
    const onePost = document.createElement('div');
    onePost.classList.add('post');

    //figure
    const figure = document.createElement('figure');
    figure.appendChild(headingH6);
    figure.appendChild(imageLink);
    figure.appendChild(detailsDiv);
    figure.appendChild(figcaption);
    onePost.appendChild(figure);

    //------add post to feed----------------------------------------------------
    postFeed.appendChild(onePost);
  })
};


const getPost = async () => {
  try {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/post', fetchOptions);
    const posts = await response.json();
    allPosts(posts);
  } catch (e) {
    console.log(e.message);
  }
};
getPost();

// Function for sorting out the articles
const sortArticlesBySearchTerms = async (searchParams) => {

}