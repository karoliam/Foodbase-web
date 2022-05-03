'use strict';

// Select the elements
const logout = document.querySelector('#logout-link');
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const area = document.querySelector('#area');
const feedPreferences = document.querySelector('#feed-preferences');
const deleteButton = document.querySelector('#delete-button');

// Grab user and preferences from session storage
const sessionUser = JSON.parse(sessionStorage.getItem('user'));
const sessionPreferences = JSON.parse(sessionStorage.getItem('preferences'));

// Check that sessionUser is found
if (!sessionUser) {
  location.href = "../html/login-and-signup.html";
} else {
  // Logout functionality
  logout.addEventListener('click', evt => {
    logUserOut();
  })

  // Profile delete functionality
  deleteButton.addEventListener('click',async (evt) => {
    const confirmation = prompt('Are you sure you want to delete your profile?','Your password please, you don\'t need it anymore now do you...');
    if (confirmation) {
      //Call for the function
      await deleteProfile(confirmation);
    }
  })

  // Generate the data and populate the elements

  // Username
  let pUser = document.createElement('p');
  pUser.innerText = `Username: ${sessionUser.username}`;
  pUser.id = 'username-text';
  username.appendChild(pUser);

  // Email
  const pEmail = document.createElement('p');
  pEmail.innerText = `E-mail: ${sessionUser.email}`;
  pEmail.id = 'email-text';
  email.appendChild(pEmail);

  // Area
  const pArea = document.createElement('p');
  pArea.innerText = `Area: ${sessionUser.area}`;
  pArea.id = 'area-text';
  area.appendChild(pArea);

  // FeedPreferences
  // Add header
  const preferencesHeader = document.createElement('h6');
  preferencesHeader.innerText = 'Feed preferences:';
  preferencesHeader.id = 'preferences-header';
  feedPreferences.appendChild(preferencesHeader);
  // Add preferences
  for (const pref in sessionPreferences) {
    const pPreference = document.createElement('p');
    pPreference.innerText = `${sessionPreferences[pref].display_name}`;
    pPreference.id = `${sessionPreferences[pref].name}`;
    feedPreferences.appendChild(pPreference);
  }
}

// Profile deletion function
const deleteProfile = async (password) => {
  try {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({password: password}),
    };

    const response = await fetch(url + `/user/${sessionUser.ID}`, fetchOptions);
    const deleteProfile = await response.json();
    //Inform the user
    alert(deleteProfile.message);
    //Redirect to feed if delete was successful
    if (deleteProfile.deleteSuccessful) {
      location.href = '../html/feed.html';
      logUserOut();
    }
  } catch (e) {
    console.log(e.message);
  }
};
