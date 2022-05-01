'use strict';

// TODO: Messaging. Currently only checks that user is logged in.
const sessionUser = JSON.parse(sessionStorage.getItem('user'));
const messageTextarea = document.querySelector('#contact');
const messageSubmitButton = document.querySelector('#send-button');

messageTextarea.addEventListener('input', evt => {
  // Check that sessionUser is found
  if (!sessionUser) {
    location.href = "../html/anonymousUser.html";
  }
})

messageSubmitButton.addEventListener('click', evt => {
  // Check that sessionUser is found
  if (!sessionUser) {
    location.href = "../html/anonymousUser.html";
  } else {
    // TODO: The messaging functionality
  }
})


// Post generation
const postFeed = document.createElement('ul');
const article = document.createElement('article');

const allPosts = (post) => {
  postFeed.innerHTML = '';
    const main = document.querySelector('main');
    const h6 = document.createElement('h6');
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    const detailDiv = document.createElement('div');
    const locationP = document.createElement('p');
    const postDate = document.createElement('p');
    const postTime = document.createElement('p');
    const locationIcon = document.createElement('i');
    const username = document.createElement('p');
    const innerFigcap = document.createElement('p');
    const flagLink = document.createElement('a');
    const flagIcon = document.createElement('i');
    const onePost = document.createElement('li');


    locationIcon.className = "fa-solid fa-location-dot";
    h6.textContent = post.name;
    h6.classList.add('post-title');

    img.src = url + '/thumbnails/' + post.filename;
    img.alt = post.name;
    img.classList.add('post-image');

    figcaption.classList.add('description');

    //time and date into readable form
    const time = new Date(post.time_stamp).toLocaleTimeString('fi-FI',
        { timeStyle: 'short', hour12: false});
    const date = new Date(post.time_stamp).toLocaleDateString();

    //details (under the picture)
    detailDiv.classList.add('details');
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
    innerFigcap.textContent = post.description;
    innerFigcap.classList.add('descriptionText');
    figcaption.appendChild(username);
    figcaption.appendChild(innerFigcap);
    flagIcon.className = "fa-solid fa-flag";
    flagLink.appendChild(flagIcon);
    figcaption.appendChild(flagLink);

//adding figcaption, image and title to figure
    figure.appendChild(figcaption);
    figure.appendChild(h6);
    figure.appendChild(img);

//adding details and figcaption to figure, header, figure and p to article and finally article to main
    figure.appendChild(detailDiv);
    figure.appendChild(figcaption);
    onePost.classList.add('post');
    onePost.appendChild(figure);
    postFeed.classList.add('post-feed');
    postFeed.appendChild(onePost);
    article.appendChild(postFeed);
    main.appendChild(article);
};

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
    allPosts(post);
  } catch (e) {
    console.log(e.message);
  }
};
getPost();
