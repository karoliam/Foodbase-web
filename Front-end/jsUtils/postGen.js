'use strict';

// Generate a list of posts or a single post according to the boolean 'single'
const postGenerator = async (feedElement, fetchedPosts, withLink, withFlag, editable, moderated) => {
  fetchedPosts.forEach((post, loopIndex) => {
    //create needed elements, generate their data and add the to postFeed

    //------header--------------------------------------------------------------
    const headingH6 = document.createElement('h6');
    headingH6.textContent = post.name;
    headingH6.className = 'post-title';

    //------imgLinkLabel (with edit and delete links)---------------------------
    const imgLinkLabel = document.createElement('label');
    //Only generate icons if the post is editable or moderated
    if (editable || moderated) {
      imgLinkLabel.htmlFor = 'post-image';
      //deleteLink
      const deleteLink = document.createElement('a');

      //icon for deleteLink
      const deleteIcon = document.createElement('i');
      deleteIcon.className = 'fa-solid fa-trash-can';
      deleteLink.appendChild(deleteIcon);
      if (moderated) {
        // deleteLink functionality for moderator use
        deleteLink.addEventListener('click', evt => {
          evt.preventDefault();
          //prompts the moderator whether they want to delete the post
          const postDeleteConfirm = confirm('Delete the selected post?');
          if (postDeleteConfirm) {
            // delete the selected post
            deletePost(post.ID);
          }
        })
        //append the deleteLink to imgLinkLabel
        imgLinkLabel.appendChild(deleteLink);
      } else {
        //editLink
        const editLink = document.createElement('a');
        editLink.href = `edit-post.html?id=${post.ID}`;
        editLink.id = 'editLink';
        //icon for editLink
        const editIcon = document.createElement('i');
        editIcon.className = 'fa-solid fa-pen-to-square';
        editLink.appendChild(editIcon);

        // deleteLink functionality for normal use
        deleteLink.addEventListener('click', evt => {
          evt.preventDefault();
          //prompts the user whether they want to delete the post
          const postDeleteConfirm = confirm('Delete the selected post?');
          if (postDeleteConfirm) {
            // delete the selected post
            deletePost(post.ID);
          }
        })
        //append both elements to imgLinkLabel
        imgLinkLabel.appendChild(editLink);
        imgLinkLabel.appendChild(deleteLink);
      }
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

    //append elements to figCaption
    figcaption.appendChild(username);
    figcaption.appendChild(innerFigDescription);
    figcaption.appendChild(foodFactDetails);

    //only when a flag is needed create and append it to figCaption
    if (withFlag) {
      //flagLink and its content (flagLink)
      const flagLink = document.createElement('a');
      flagLink.id = 'flag-link';
      const flagIcon = document.createElement('i');
      flagIcon.className = 'fa-solid fa-flag';
      flagLink.appendChild(flagIcon);
      //Listener
      flagLink.addEventListener('click', evt => {
        evt.preventDefault();
        // Check that user is logged in
        const sessionUser = JSON.parse(sessionStorage.getItem('user'));
        if (!sessionUser) {
          location.href = '../html/anonymousUser.html';
        } else {
          //call the flagPost function with the post's position index and ID
          flagPost(loopIndex, post.ID);
        }
      }, {once: true})
      //append
      figcaption.appendChild(flagLink);
    }

    //only when moderated, add the information about reports and messages
    if (moderated) {
      console.log(post);
      const reportInfo = document.createElement('div');
      const reportSummary = document.createElement('h6');
      reportSummary.className = 'post-title';
      reportSummary.innerText = `Reports: ${post.reports.length}`;
      reportInfo.appendChild(reportSummary);
      //for each report add an information-box
      for (const report in post.reports) {
        const reason = document.createElement('p');
        reason.className = 'username';
        reason.innerText = post.reports[report].reason;
        reportInfo.appendChild(reason);
      }
      //append
      figcaption.appendChild(reportInfo);
    }

    //------onePost (contains the generated post)-------------------------------
    const onePost = document.createElement('div');
    onePost.id = `post-no-${loopIndex}`;
    onePost.className = 'post';

    //figure
    const figure = document.createElement('figure');
    figure.appendChild(headingH6);
    if (editable || moderated) {
      //append the editable/moderated post icon(s)
      figure.appendChild(imgLinkLabel);
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

// Post deletion function for normal users
const deletePost = async (postID) => {
  try {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + `/post/${postID}`, fetchOptions);
    await response.json();
    //Reload page
    const sessionUser = JSON.parse(sessionStorage.getItem('user'));
    if (sessionUser.role === 0) {
      location.href = '../html/moderatorTools.html';
    } else {
      location.href = '../html/yourPosts.html';
    }
  } catch (e) {
    console.log(e.message);
  }
};

// Post flagging function
const flagPost = (postPosition, postID) => {
  //Select the post figcaption to append the reportForm
  const appendFigcaption = document.querySelector(`#post-no-${postPosition} figcaption`);

  // reportInput
  const reportInput = document.createElement('input');
  reportInput.id = 'report-input';
  reportInput.type = 'text';
  reportInput.maxLength = 1000;
  reportInput.name = 'message';
  reportInput.placeholder = 'Leave a short explanation';

  // reportInputLabel
  const reportInputLabel = document.createElement('label');
  reportInputLabel.htmlFor = reportInput.id;
  reportInputLabel.innerText = 'Report-message:';

  // reportSubmit
  const reportSubmit = document.createElement('button');
  reportSubmit.type = 'submit';
  reportSubmit.id = 'report-submit';
  reportSubmit.innerText = 'Send report';

  // reportForm and appends
  const reportForm = document.createElement('form');
  reportForm.className = 'report-form';

  // Appends
  reportForm.appendChild(reportInputLabel);
  reportForm.appendChild(reportInput);
  reportForm.appendChild(reportSubmit);

  // On submit
  reportForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    // Send the report for moderators to be examined
    const reportMSG = document.querySelector(`#post-no-${postPosition} input`);
    try {
      const fetchOptions = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({postID: postID, reason: reportMSG.value}),
      };
      const response = await fetch(url + `/post/reported/${postID}`, fetchOptions);
      await response.json();
    } catch (e) {
      console.log(e.message);
    }
    appendFigcaption.removeChild(reportForm);
  })
  // Append the reportForm to the post
  appendFigcaption.appendChild(reportForm);
}