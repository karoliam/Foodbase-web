'use strict';

// Select the elements
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const area = document.querySelector('#area');
const allergensDiv = document.querySelector('#allergens');
const dietsDiv = document.querySelector('#diets');
const profileForm = document.querySelector('#userinfo-edit');
const passwdForm = document.querySelector('#password-edit');

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

// On submit
profileForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  // Make a FormData object from the profileForm
  const formedProfileForm = new FormData(profileForm);

  // Add the user's ID to the payload
  const currentID = sessionUser.ID;
  formedProfileForm.set('ID', currentID);

  // Create the options for putting the profile data
  const fetchOptions = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: formedProfileForm,
  };
  const response = await fetch(url + '/user/profile', fetchOptions);
  const profileUpdateResponseJson = await response.json();

  // Prompt the user to log in again (if all went well)
  if (profileUpdateResponseJson.profileUpdated === true) {
    alert(`${profileUpdateResponseJson.message} Please log in again to see changes!`);
    return;
  }
  alert(`${profileUpdateResponseJson.message}`);
})

//---------------------Password-edit-form--------------------------------------
const password = document.querySelector('#password');
const passwordAgain = document.querySelector('#re-enter-password');
const passwordError = document.querySelector('#password-error');

// On submit
passwdForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  //First check if the user has entered the password in both inputs similarly
  if (!(password.value === passwordAgain.value)) {
    passwordError.innerHTML = 'Password fields do not match';
    return;
  } else {
    passwordError.innerHTML = '';
  }
  // Make a FormData object from the passwordForm
  const formedPasswdForm = new FormData(passwdForm);

  // Remove redundant data
  formedPasswdForm.delete('re-enter-password');
  formedPasswdForm.delete('username');

  // Add the user's email and ID to the payload
  const currentMail = sessionUser.email;
  const currentID = sessionUser.ID;
  formedPasswdForm.set('email', currentMail);
  formedPasswdForm.set('ID', currentID);

  // Create the options for putting the data
  const fetchOptions = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: formedPasswdForm,
  };
  const response = await fetch(url + '/user/password', fetchOptions);
  const passwordUpdateResponseJson = await response.json();

  // Relog the user in (if all went well)
  if (passwordUpdateResponseJson.passwordUpdated === true) {
    formedPasswdForm.set('username', currentMail);
    const newFetchOptions = {
      method: 'POST',
      headers: {},
      body: formedPasswdForm,
    };
    await logUserIn(newFetchOptions, 0);
  }
  alert(passwordUpdateResponseJson.message);
})