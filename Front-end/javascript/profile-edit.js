'use strict';

// Select the elements
const username = document.querySelector('#username');
const email = document.querySelector('#e-mail');
const area = document.querySelector('#area');
const feedPreferences = document.querySelector('#feed-preferences');

// Add the elements to an array
const fillElements = [
  username,
  email,
  area,
  feedPreferences,
]

// Grab user and preferences from session storage
const sessionUser = JSON.parse(sessionStorage.getItem('user'));
const sessionPreferences = JSON.parse(sessionStorage.getItem('preferences'));

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