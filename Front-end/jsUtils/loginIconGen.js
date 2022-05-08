'use strict';

// Author Karoliina M.

const createLoginIcon = (logout) => {
  //creating list, link and icon elements and assigning classnames, id's and hrefs
  const login = document.createElement('li');
  login.className = 'login';
  const loginLink = document.createElement('a');
  loginLink.id = 'login-link';
  loginLink.href = 'login-and-signup.html';
  const loginIcon = document.createElement('i');
  loginIcon.className = 'fa-solid fa-lock-open';
  //appending loginIcon to loginLink
  loginLink.appendChild(loginIcon);
  //Creating span where Login text will be placed
  const loginText = document.createElement('span');
  loginText.id = 'login-text';
  loginText.textContent = 'Login';
  //Appending login text to loginLink, appending LoginLink to login div and replacing logout div with login div
  loginLink.appendChild(loginText);
  login.appendChild(loginLink);
  logout.parentNode.replaceChild(login, logout);
}