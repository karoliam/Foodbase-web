const postUl = document.getElementsByClassName('post-feed');
const url = 'https://localhost:3000';


const allPosts = (posts) => {
  postUl.innerHTML = '';
  posts.forEach((post) => {
    const onePost = document.createElement('li');
    onePost.classList.add('one-post');
    const postFigure = document.createElement('figure');
    postFigure.classList.add('post-figure');
    const postTitle = document.createElement('h6');
    postTitle.classList.add('post-title');
    postTitle.innerText = post.title;
    postFigure.appendChild(postTitle);
    const postImageLink = document.createElement('a');
    postImageLink.href = "openedPost.html";
    const postImage = document.createElement('img');
    postImage.src = post.filename;
    postImage.alt = post.title;
    postImage.classList.add('post-image');
    postImageLink.appendChild(postImage);
    postFigure.appendChild(postImageLink);
    const details = document.createElement('div');
    details.classList.add('details');
    const postLocation = document.createElement('p');
    postLocation.innerText = post.area;
    const locationIcon = document.createElement('i');
    locationIcon.classList.add('fa-solid fa-location-dot');
    postLocation.appendChild(locationIcon);
    const postDate = document.createElement('p');
    postDate.classList.add('date');
    postDate.innerText = post.date;
    const postTime = document.createElement('p');
    postTime.classList.add('time');
    postTime.innerText = post.time;
    postFigure.appendChild(details);
    const description = document.createElement('figcaption');
    description.classList.add('description');
    description.innerText = post.description;
    const postUsername = document.createElement('p');
    postUsername.classList.add('username');
    postUsername.innerText = post.username;
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
  })
};

const getAllPosts = async () => {
  try {
    const response = await fetch(url + '/post');
    const posts = await response.json();
    allPosts(posts);
  } catch (e) {
    console.log(e.message);
  }
};
getAllPosts();
