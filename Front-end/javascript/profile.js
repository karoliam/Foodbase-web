'use strict';

// Select the elements

const username = document.querySelector('#username');
const email = document.querySelector('#e-mail');
const area = document.querySelector('#area');
const feedPreferences = document.querySelector('#feed-preferences');


// Fetch the list of feedPreferences
const response = await fetch(url + '/food/');
const feedPreferenceList = await response.json();