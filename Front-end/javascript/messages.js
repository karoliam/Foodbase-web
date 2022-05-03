'use strict';

const sessionUser = JSON.parse(sessionStorage.getItem('user'));

// Check that sessionUser is found
if (!sessionUser) {
  location.href = "../html/anonymousUser.html";
} else {



}
