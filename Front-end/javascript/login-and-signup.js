'use strict';
const url = 'https://localhost:3000';

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
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  //First serialize the form
  const serializedLoginForm = serializeForm(loginForm);
  //Stringify the user object
  const stringifiedForm = JSON.stringify(serializedLoginForm.user);

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: stringifiedForm,
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
  // Serialize the form data
  const serializedSignupForm = serializeForm(signupForm);

  // Create the options for posting the data
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serializedSignupForm),
  };
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
    newPreference.name = checkboxlist[i];
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

// Serialization function
function serializeForm (formToBeSerialized) {
  // The user data and preferences-data will be added to signupFormData object
  let signupFormData = {
    user: {

    },
    preferences: {

    },
  };

  for (let i = 0; i<formToBeSerialized.children.length; i++) {
    const dataItem = formToBeSerialized.children[i];

    // To be able to identify the most important user data
    const stringValueIdentifiers = ['username', 'password', 'email'];

    // Add the user data to the user object
    if (stringValueIdentifiers.includes(dataItem.name)) {
      const formDataUnit = dataItem.name;
      const formDataUnitContent = dataItem.value;
      signupFormData.user[`${formDataUnit}`] = `${formDataUnitContent}`;
    }

    // Add the foodFacts
    if (dataItem.id === 'food-facts') {
      // We dig out the checkbox 'checked' -value from both the allergen and diet lists

      // Allergens
      for (let i = 0; i<dataItem.firstElementChild.children.length; i++) {
        const allergen = dataItem.firstElementChild.children[i].children[0];
        // If it is checked we add the allergen name to the preferences object
        if (allergen.checked === true) {
          const formDataUnit = allergen.name;
          const formDataUnitContent = true;
          signupFormData.preferences[`${formDataUnit}`] = `${formDataUnitContent}`;
        }
      }

      //diets
      for (let i = 0; i<dataItem.lastElementChild.children.length; i++) {
        const diet = dataItem.lastElementChild.children[i].children[0];
        // If it is checked we add the diet name to the preferences object
        if (diet.checked === true) {
          const formDataUnit = diet.name;
          const formDataUnitContent = true;
          signupFormData.preferences[`${formDataUnit}`] = `${formDataUnitContent}`;
        }
      }
    }
  }
  return signupFormData;
}