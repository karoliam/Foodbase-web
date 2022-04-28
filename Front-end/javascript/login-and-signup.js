'use strict';

// selecting login and signup forms and their necessary children
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error-message');

const signupForm = document.querySelector('#signup-form');
const signupPassword = document.querySelector('#signup-password');
const signupPasswordAgain = document.querySelector('#signup-password-again');
const area = document.querySelector('#area');
const allergensUL = document.querySelector('#allergens');
const dietsUL = document.querySelector('#diets');
const signupError = document.querySelector('#signup-error-message');

//---------------Login form----------------------------------------------------
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  //First serialize the form
  const formedLoginForm = new FormData(loginForm);

  const fetchOptions = {
    method: 'POST',
    headers: {},
    body: formedLoginForm,
  };

  // Waiting for server response. Saving token if response ok
  const response = await fetch(url + '/auth/login', fetchOptions);
  const loginJsonResponse = await response.json();

  //If the response doesn't contain the user or token
  if (!loginJsonResponse.user || !loginJsonResponse.token) {
    loginError.innerHTML = loginJsonResponse.message ;
  } else {
    // save the token
    sessionStorage.setItem('token', loginJsonResponse.token);
    sessionStorage.setItem('user', JSON.stringify(loginJsonResponse.user));
    location.href = '../html/feed.html';
  }
});

//---------------Signup form----------------------------------------------------

// Generating the form inputs

// Generate the area dropdown options
generateAreaList(area);
// Generate List of allergens
generateCheckBoxList(allergensUL,0);
// generate List of diets
generateCheckBoxList(dietsUL,1);

// When the form is submitted
signupForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  //First check if the user has entered the password in both inputs similarly
  if (!(signupPassword.value === signupPasswordAgain.value)) {
    signupError.innerHTML = "Password fields do not match";
    return;
  }
  // Make a FormData object from the signupForm
  const formedSignupForm = new FormData(signupForm);
  delete formedSignupForm.delete('re-enter-password');
  // Create the options for posting the data
  const fetchOptions = {
    method: 'POST',
    headers: {},
    body: formedSignupForm,
  };
  const response = await fetch(url + '/auth/signup', fetchOptions);
  const signupJsonResponse = await response.json();
  alert(signupJsonResponse.message);
});