'use strict';

// Generate a list of posts or a single post according to the boolean 'single'
const postGenerator = async (feedElement, fetchedPosts, withLink, editable) => {
  fetchedPosts.forEach((post) => {
    //create needed elements, generate their data and add the to postFeed

    //------header--------------------------------------------------------------
    const headingH6 = document.createElement('h6');
    headingH6.textContent = post.name;
    headingH6.className = 'post-title';

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
    imageLink.href = `openedPost.html?id=${post.ID}&user=${post.username}&userid=${post.owner_ID}`;
    imageLink.className = 'post-image-link';

    //set image attributes and append to imageLink
    const img = document.createElement('img');
    img.src = url + '/thumbnails/' + post.filename;
    img.alt = post.name;
    img.className = 'post-image';
    imageLink.appendChild(img);

    //------detailsDiv (under the picture)--------------------------------------
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'details';

    //location and its content (locationIcon)
    const locationP = document.createElement('p');
    locationP.className = 'location';
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
    figcaption.className = 'description';

    //username
    const username = document.createElement('p');
    username.className = 'username';
    username.textContent = post.username;

    //inner description for the figure
    const innerFigDescription = document.createElement('p');
    innerFigDescription.textContent = post.description;
    innerFigDescription.className = 'descriptionText';

    //foodFacts
    const foodFactDetails = document.createElement('details');
    foodFactDetails.className = 'post-food-fact-details';
    //summary for foodFact
    const foodFactsSummary = document.createElement('summary');
    foodFactsSummary.innerText = 'Food-facts:';
    foodFactDetails.appendChild(foodFactsSummary);
    //foodFactsDiv to contain the foodFacts
    const foodFactsDiv = document.createElement('div');
    foodFactsDiv.className = 'post-food-facts-div';
    //For every foodFact generate an element and add it to a list
    const postPreferences = post.preferences;
    for (const pref in postPreferences) {
      const foodFact = document.createElement('p');
      foodFact.innerText = `${postPreferences[pref].display_name}   `;
      foodFact.className = 'post-food-fact';
      const checkIcon = document.createElement('i');
      checkIcon.className = 'fa-solid fa-check';
      //append checkIcon to foodFact and add to foodFacts
      foodFact.appendChild(checkIcon);
      foodFactsDiv.appendChild(foodFact);
    }
    //append foodFactsDiv to the details-element
    foodFactDetails.appendChild(foodFactsDiv);

    //flagLink and its content (flagLink)
    const flagLink = document.createElement('a');
    const flagIcon = document.createElement('i');
    flagIcon.className = 'fa-solid fa-flag';
    flagLink.appendChild(flagIcon);

    //append elements to figCaption
    figcaption.appendChild(username);
    figcaption.appendChild(innerFigDescription);
    figcaption.appendChild(foodFactDetails)
    figcaption.appendChild(flagLink);

    //------onePost (contains the generated post)-------------------------------
    const onePost = document.createElement('div');
    onePost.className = 'post';

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

    //------add onePost to feed----------------------------------------------------
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