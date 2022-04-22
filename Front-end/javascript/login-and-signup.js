'use strict';
const url = 'https://localhost:8200';

// selecting login and signup forms and their necessary children
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error-message');

const signupForm = document.querySelector('#signup-form');
const signupPassword = document.querySelector('#signup-password');
const signupPasswordAgain = document.querySelector('#signup-password-again');
const allergensUL = document.querySelector('#allergens');
const dietsUL = document.querySelector('#diets');
const signupError = document.querySelector('#signup-error-message');

// Login form
// loginForm.attributes.action="https://localhost:8200/auth/login";
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  // Waiting for server response. Saving token if response ok
  const response = await fetch(url + '/auth/login', fetchOptions);
  const loginJsonResponse = await response.json();

  // TODO: Remove logging the login response before "publishing"
  console.log(url);
  console.log('login response', loginJsonResponse);

  //If the response doesn't contain the user or token
  if (!loginJsonResponse.user || !loginJsonResponse.token) {
    loginError.innerHTML = loginJsonResponse.message ;
  } else {
    // save the token
    sessionStorage.setItem('token', loginJsonResponse.token);
    sessionStorage.setItem('user', JSON.stringify(loginJsonResponse.user));
    location.href = 'mainView.html';
  }
});

// Signup form

// Generate the feed-preference lists upon page load

// List of allergens
generateCheckBoxList(allergenList, allergensUL, '-free');
// List of diets
generateCheckBoxList(dietList, dietsUL, '');

// When the form is submitted
signupForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  //First check if the user has entered the password in both inputs similarly
  if (!(signupPassword.value === signupPasswordAgain.value)) {
    signupError.innerHTML = "Password fields do not match";
    return;
  }


  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/form-data',
    }
  };
  // TODO: Remove logging the data before "publishing"
  console.log(JSON.stringify(data));
  const response = await fetch(url + '/auth/signup', fetchOptions);
  const signupJsonResponse = await response.json();
  alert(signupJsonResponse.message);
});

//function for generating the checkbox lists
function generateCheckBoxList(checkboxlist, appendList, addonString) {
  for (let i = 0; i<checkboxlist.length; i++) {
    //Create input
    const newPreference= document.createElement('input');
    const checkboxText = `${checkboxlist[i]}${addonString}`;
    newPreference.id = checkboxText;
    newPreference.type = "checkbox";
    newPreference.name = checkboxText;
    //Create label for input
    const newPreferenceLabel = document.createElement('label');
    newPreferenceLabel.htmlFor = `${newPreference.id}`;
    newPreferenceLabel.textContent = checkboxText;

    //Append the input with label to the list of feedPreferences
    const li = document.createElement('li');
    li.appendChild(newPreference);
    li.appendChild(newPreferenceLabel);
    appendList.appendChild(li);
  }
}