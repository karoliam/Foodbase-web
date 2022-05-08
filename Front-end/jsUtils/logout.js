'use strict';

//  Author Reima N.

// Logout button enabler
const logout = document.querySelector('#logout-link');
logout.addEventListener('click', evt => {
  logUserOut();
})

// Logs the user out
const logUserOut = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('preferences');
  location.href = '../html/feed.html';
}