'use strict';

// Select the elements
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const area = document.querySelector('#area');
const allergensDiv = document.querySelector('#allergens');
const dietsDiv = document.querySelector('#diets');


// Grab user and preferences from session storage
const sessionUser = JSON.parse(sessionStorage.getItem('user'));
const sessionPreferences = JSON.parse(sessionStorage.getItem('preferences'));

//---------------Generate the data and populate the elements--------------------

// Username
username.value = `${sessionUser.username}`;
// Email
email.value = `${sessionUser.email}`;
// Area
generateAreaListWithPreselect(area, sessionUser.area);
// FeedPreferences
// Generate lists of the names (not display_names) of the preferences and generate the boxes
let allergenPreferenceNames = [];
for (const pref in sessionPreferences) {
  if (sessionPreferences[pref].type === 0) {
    allergenPreferenceNames += `${sessionPreferences[pref].name}`;
  }
}
generateCheckBoxListForProfileEdit(allergensDiv, 0, allergenPreferenceNames);
let dietPreferenceNames = [];
for (const pref in sessionPreferences) {
  if (sessionPreferences[pref].type === 1) {
    dietPreferenceNames += `${sessionPreferences[pref].name}`;
  }
}
generateCheckBoxListForProfileEdit(dietsDiv, 1, dietPreferenceNames);

//---------------------Userinfo-edit-form--------------------------------------



//---------------------Password-edit-form--------------------------------------