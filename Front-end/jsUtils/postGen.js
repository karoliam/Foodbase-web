'use strict';

// Generate a list of posts or a single post according to the boolean 'single'
const postGenerator = async (feedElement, fetchedPosts, withLink, editable) => {
  fetchedPosts.forEach((post) => {
    //create needed elements, generate their data and add the to postFeed

    //------header--------------------------------------------------------------
    const headingH6 = document.createElement('h6');
    headingH6.textContent = post.name;
    headingH6.classList.add('post-title');

    //------imgLinkLabel (with edit and delete links)---------------------------

    //Only generate icons if the post is editable
    const imgLabel = document.createElement('label');
    if (editable) {
      imgLabel.htmlFor = 'post-image';

      //editLink
      const editLink = document.createElement('a');
      editLink.href = `edit-post.html?id=${post.ID}`;
      editLink.id = 'editLink';
      //icon for editLink
      const editIcon = document.createElement('i');
      editIcon.className = 'fa-solid fa-pen-to-square';
      editLink.appendChild(editIcon);

      //deleteLink
      const deleteLink = document.createElement('a');
      deleteLink.addEventListener('click', evt => {
        //prompts the user whether they want to delete the post
        const postDeleteConfirm = confirm('Delete the selected post?');
        if (postDeleteConfirm) {
          // delete the selected post
          deletePost(post.ID);
        }
      })
      //icon for deleteLink
      const deleteIcon = document.createElement('i');
      deleteIcon.className = 'fa-solid fa-trash-can';
      deleteLink.appendChild(deleteIcon);

      //append elements to imgLinkLabel
      imgLabel.appendChild(editLink);
      imgLabel.appendChild(deleteLink);
    }

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



    //foodFacts
    // let foodFacts = post;
    // foodFacts.shift();
    // for (const fact in foodFacts) {
    //   //
    // }

    // <i className="fa-solid fa-check"></i>

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
    if (editable) {
      //append the editable post icons
      figure.appendChild(imgLabel);
    }
    if (withLink) {
      //append the link with embedded image
      figure.appendChild(imageLink);
    } else {
      //append only the image
      figure.appendChild(img);
    }
    figure.appendChild(detailsDiv);
    figure.appendChild(figcaption);
    onePost.appendChild(figure);

    //------add post to feed----------------------------------------------------
    feedElement.appendChild(onePost);
  })
}

// Post deletion function
const deletePost = async (postID) => {
  try {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + `/post/${postID}`, fetchOptions);
    const deletePost = await response.json();
    // TODO: Remove this log
    console.log(deletePost.message);
    //Reload page
    location.href = '../html/yourPosts.html';
  } catch (e) {
    console.log(e.message);
  }
};