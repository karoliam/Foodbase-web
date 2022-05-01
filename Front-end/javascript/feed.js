'use strict';

// Search functionality
const allergensDiv = document.querySelector('#allergens');
const dietsDiv = document.querySelector('#diets');
const searchBar = document.querySelector('#search-bar')
const sessionPreferences = JSON.parse(sessionStorage.getItem('preferences'));

// Test if user is logged in
if (!sessionPreferences) {
  // Generate checkbox lists without precheck
  generateCheckBoxList(allergensDiv,0);
  generateCheckBoxList(dietsDiv,1);
} else {
  // Generate prechecked checkbox lists
  generateCheckBoxListWithPreCheck(allergensDiv, 0, sessionPreferences);
  generateCheckBoxListWithPreCheck(dietsDiv, 1, sessionPreferences);
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
const postFeed = document.createElement('div');
const article = document.createElement('article');

const allPosts = (posts) => {
  postFeed.innerHTML = '';
  posts.forEach((post) => {
      //select main element
      const main = document.querySelector('main');

      //create elements
      const figure = document.createElement('figure');
      const h6 = document.createElement('h6');
      const img = document.createElement('img');
      const figcaption = document.createElement('figcaption');
      const imageLink = document.createElement('a');
      const detailDiv = document.createElement('div');
      const locationP = document.createElement('p');
      const postDate = document.createElement('p');
      const postTime = document.createElement('p');
      const locationIcon = document.createElement('i');
      const username = document.createElement('p');
      const innerFigCap = document.createElement('p');
      const preferences = document.createElement('p');
      const flagLink = document.createElement('a');
      const flagIcon = document.createElement('i');
      const onePost = document.createElement('div');


    //heading
    h6.textContent = post.name;
    h6.classList.add('post-title');

    //image
    img.src = url + '/thumbnails/' + post.filename;
    img.alt = post.name;
    img.classList.add('post-image');

    figcaption.classList.add('description');
    imageLink.href = `openedPost.html?id=${post.ID}`;
    imageLink.classList.add('post-image-link');

    //time and date into readable form
    const time = new Date(post.time_stamp).toLocaleTimeString('fi-FI',
        { timeStyle: 'short', hour12: false});
    const date = new Date(post.time_stamp).toLocaleDateString();

    //details (under the picture)
    detailDiv.classList.add('details');
    locationIcon.className = "fa-solid fa-location-dot";
    locationP.classList.add('location');
    locationP.textContent = post.area;
    postDate.textContent = date;
    postDate.classList.add('date');
    postTime.textContent = time;
    postTime.classList.add('time');
    figure.appendChild(detailDiv);
    locationP.appendChild(locationIcon);
    detailDiv.appendChild(locationP);
    detailDiv.appendChild(postDate);
    detailDiv.appendChild(postTime);

    //stuff inside of the white box (username, description and flag)
    username.classList.add('username');
    username.textContent = post.username;
    innerFigCap.textContent = post.description;
    innerFigCap.classList.add('descriptionText');
    figcaption.appendChild(username);
    figcaption.appendChild(innerFigCap);
    flagIcon.className = "fa-solid fa-flag";
    flagLink.appendChild(flagIcon);
    figcaption.appendChild(flagLink);

    //adding figcaption, image and title to figure
    figure.appendChild(figcaption);
    figure.appendChild(h6);
    imageLink.appendChild(img);
    figure.appendChild(imageLink);

    //adding details and figcaption to figure, header, figure and p to article and finally article to main
    figure.appendChild(detailDiv);
    figure.appendChild(figcaption);
    onePost.classList.add('post');
    onePost.appendChild(figure);
    postFeed.classList.add('post-feed');
    postFeed.appendChild(onePost);
    article.appendChild(postFeed);
    main.appendChild(article);

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