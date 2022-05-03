'use strict';

const logUserOut = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('preferences');
  location.href = '../html/feed.html';
}