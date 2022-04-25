'use strict';

const div = document.querySelector('main');
const article = document.createElement('article');
const header = document.createElement('header');
const h6 = document.createElement('h6');
const figure = document.createElement('figure');
const img = document.createElement('img');
const figcaption = document.createElement('figcaption');
const p = document.createElement('p');
const link = document.createElement('a');
const detailDiv = document.createElement('div');
const locationP = document.createElement('p');
const locationIcon = document.createElement('i');

h6.textContent = 'Donuts';
h6.classList.add('post-title');

img.src = 'https://via.placeholder.com/500';
img.alt = 'placeholder';
img.classList.add('post-image');

figcaption.classList.add('description');
link.href = 'openedPost.html';
link.classList.add('post-image-link');

detailDiv.classList.add('details');
locationP.classList.add('location');
locationP.textContent = 'Pasila';



figcaption.textContent = 'Here is some text. Here is some text. Here is some text. Here is some text.';
p.textContent = 'Here is some text. Here is some text. Here is some text. Here is some text.';


/*<a href="openedPost.html" class="post-image-link"><img src="https://via.placeholder.com/500" alt="placeholder" class="post-image"></a>
<div class="details">
  <p class="location"><i class="fa-solid fa-location-dot"></i>Location</p>
  <p class="date">20.04.2022</p>
  <p class="time">22:30</p>
</div>
<figcaption class="description"><p class="username">horse_girl_94</p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
  <br><a href=""><i class="fa-solid fa-flag"></i></a></br></figcaption>
</figure>*/


figure.appendChild(h6);
link.appendChild(img);
figure.appendChild(link);

locationP.appendChild(locationIcon);
detailDiv.appendChild(locationP);
figure.appendChild(detailDiv);

figure.appendChild(figcaption);
article.appendChild(header);
article.appendChild(figure);
article.appendChild(p);
div.appendChild(article);

/*
const onePost = document.createElement('li');
onePost.classList.add('one-post');
const postFigure = document.createElement('figure');
postFigure.classList.add('post-figure');
const postTitle = document.createElement('h6');
postTitle.classList.add('post-title');
postTitle.textContent = "Donut"
postFigure.appendChild(postTitle);
const postImageLink = document.createElement('a');
postImageLink.href = "openedPost.html";
const postImage = document.createElement('img');
postImage.src = "https://via.placeholder.com/500";
postImage.alt = 'postaus';
postImage.classList.add('post-image');
postImageLink.appendChild(postImage);
postFigure.appendChild(postImageLink);
const details = document.createElement('div');
details.classList.add('details');
const location = document.createElement('p');
location.textContent = "Pasila"
const locationIcon = document.createElement('i');
locationIcon.classList.add('fa-solid fa-location-dot');
location.appendChild(locationIcon);
const postDate = document.createElement('p');
postDate.classList.add('date');
postDate.textContent = "11.4.2022";
const postTime = document.createElement('p');
postTime.classList.add('time');
postTime.textContent = "10:34"
postFigure.appendChild(details);
const description = document.createElement('figcaption');
description.classList.add('description');
description.textContent = "lsosdfjodsjfdosijosidjfoijsdoifjsdofijodis";
const postUsername = document.createElement('p');
postUsername.classList.add('username');
postUsername.textContent = "kissakoira";
const flagLink = document.createElement('a');
flagLink.href = '';
const flagIcon = document.createElement('i');
flagIcon.classList.add('fa-solid fa-flag');
description.appendChild(postUsername);
flagLink.appendChild(flagIcon);
description.appendChild(flagLink);
postFigure.appendChild(description);
onePost.appendChild(postFigure);
postUl.appendChild(onePost);

*/