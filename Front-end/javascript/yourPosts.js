'use strict';

const postFeed = document.createElement('div');
function showSearch() {
    document.querySelector('.search-bar').style.display = 'block';
}
const article = document.createElement('article');

const allPosts = (posts) => {
    postFeed.innerHTML = '';
    posts.forEach((post) => {
        const main = document.querySelector('main');
        const h6 = document.createElement('h6');
        const figure = document.createElement('figure');
        const label = document.createElement('label');
        const editLink = document.createElement('a');
        const editIcon = document.createElement('i');
        const deleteLink = document.createElement('a');
        const deleteIcon = document.createElement('i');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');
        const imageLink = document.createElement('a');
        const detailDiv = document.createElement('div');
        const locationP = document.createElement('p');
        const postDate = document.createElement('p');
        const postTime = document.createElement('p');
        const locationIcon = document.createElement('i');
        const username = document.createElement('p');
        const innerFigcap = document.createElement('p');
        const flagLink = document.createElement('a');
        const flagIcon = document.createElement('i');
        const onePost = document.createElement('div');

        //edit and delete icons are forming here
        editLink.href = `edit-post.html?id=${post.ID}`;
        editLink.id = 'editLink'
        editIcon.className = 'fa-solid fa-pen-to-square';
        //currently delete just redirects to edit post
        deleteLink.href = `edit-post.html?id=${post.ID}`;
        deleteIcon.className = 'fa-solid fa-trash-can';
        label.setAttribute('for', 'post-image');

        locationIcon.className = 'fa-solid fa-location-dot';
        h6.textContent = post.name;
        h6.classList.add('post-title');

        img.src = url + '/thumbnails/' + post.filename;
        img.alt = post.name;
        img.classList.add('post-image');


        figcaption.classList.add('description');
        imageLink.href = `openedPost.html?id=${post.ID}`;
        imageLink.classList.add('post-image-link');

        //time and date into readable form
        const time = new Date(post.time_stamp).toLocaleTimeString('fi-FI',
            {timeStyle: 'short', hour12: false});
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
        figure.appendChild(label);
        label.appendChild(h6);
        label.appendChild(editLink);
        label.appendChild(deleteLink);
        editLink.appendChild(editIcon);
        editLink.appendChild(deleteIcon);
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
        const userData=JSON.parse(sessionStorage.getItem('user'));
        const id = userData.ID;
        console.log(id);
        console.log(userData);
        const response = await fetch(url + `/post/yourPosts/${id}`, fetchOptions);
        const posts = await response.json();
        allPosts(posts);
    } catch (e) {
        console.log(e.message);
    }
};
getPost();
