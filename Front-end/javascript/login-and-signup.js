'use strict';
const url = 'https://localhost:3000';

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

//---------------Signup form----------------------------------------------------

// Generating the form inputs

// Generate the area dropdown options
generateAreas(area);
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
  // Serialize the form data
  const serializedSignupForm = serializeForm(signupForm);
  console.log(serializedSignupForm);
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

//---------------Functions------------------------------------------------------

// Generating the area options
function generateAreas(selectElement) {
  //list of areas
  const areaList = locations;

  //Add every location to the selectElement with a label
  for (let i = 0; i<areaList.length; i++) {
    // Create option element
    const option = document.createElement('option');
    option.id = areaList[i];
    option.value = areaList[i];
    option.innerText = areaList[i];
    // Create label for option
    const label = document.createElement('label');
    label.htmlFor = option.id;
    //Append to the selectElement
    selectElement.appendChild(label);
    selectElement.appendChild(option);
  }
}

// Serialization
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
    const stringValueIdentifiers = ['username', 'password', 'email', 'area'];

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