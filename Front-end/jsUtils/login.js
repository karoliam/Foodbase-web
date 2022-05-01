'use strict';

// Log the user in and redirect to given location string OR NOT if it is 0
const logUserIn = async (fetchOpt, redirectLocation) => {
  // Waiting for server response. Saving token if response ok
  const response = await fetch(url + '/auth/login', fetchOpt);
  const loginJsonResponse = await response.json();

//If the response doesn't contain the user or token
  if (!loginJsonResponse.user || !loginJsonResponse.token) {
    alert('Error logging the user in!');
  } else {
    // save the token
    sessionStorage.setItem('token', loginJsonResponse.token);
    sessionStorage.setItem('user', JSON.stringify(loginJsonResponse.user));
    sessionStorage.setItem('preferences', JSON.stringify(loginJsonResponse.preferences));
    if (!(redirectLocation === 0)) {
      location.href = `${redirectLocation}`;
    }
  }
}