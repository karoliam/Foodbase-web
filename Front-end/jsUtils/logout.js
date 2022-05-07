'use strict';
//  Author Reima N.

// Logs the user out
const logUserOut = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('preferences');
  location.href = '../html/feed.html';
}