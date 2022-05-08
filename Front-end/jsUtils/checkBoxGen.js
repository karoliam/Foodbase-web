'use strict';

// Author Reima N.

// Generating the checkbox lists
const generateCheckBoxList = async (appendElement, wantedType) => {
  // Fetch the list of feedPreferences
  const response = await fetch(url + '/food/');
  const prefList = await response.json();

  for (const pref in prefList) {
    // Generate only the preferences of wanted type
    if (prefList[pref].type === wantedType) {
      //Create input element
      const newPreference= document.createElement('input');
      newPreference.id = prefList[pref].name;
      newPreference.type = "checkbox";
      newPreference.name = prefList[pref].ID;
      //Create label for input
      const newPreferenceLabel = document.createElement('label');
      newPreferenceLabel.htmlFor = `${newPreference.id}`;
      newPreferenceLabel.textContent = prefList[pref].display_name;
      //Append the input with label to the list of feedPreferences
      appendElement.appendChild(newPreferenceLabel);
      appendElement.appendChild(newPreference);
    }
  }
}

// Generating the checkbox lists
const generateCheckBoxListWithPreCheck = async (appendElement, wantedType, sessionPrefs) => {
  // Fetch the list of feedPreferences
  const response = await fetch(url + '/food/');
  const feedPreferenceList = await response.json();

  // Generate lists of the names (not display_names) to be prechecked
  let preCheckNames = [];
  // For allergens
  if (wantedType === 0) {
    for (const pref in sessionPrefs) {
      if (sessionPrefs[pref].type === 0) {
        preCheckNames += `${sessionPrefs[pref].name}`;
      }
    }
  }else {
    // For diets
    for (const pref in sessionPrefs) {
      if (sessionPrefs[pref].type === 1) {
        preCheckNames += `${sessionPrefs[pref].name}`;
      }
    }
  }

  for (const i in feedPreferenceList) {
    // Generate only the preferences of wanted type
    if (feedPreferenceList[i].type === wantedType) {
      //Create input element
      const newPreference= document.createElement('input');
      newPreference.id = feedPreferenceList[i].name;
      newPreference.type = "checkbox";
      newPreference.name = feedPreferenceList[i].ID;
      //Check if in the list of preCheckNames
      if (preCheckNames.includes(newPreference.id)) {
        newPreference.checked = true;
      }
      //Create label for input
      const newPreferenceLabel = document.createElement('label');
      newPreferenceLabel.htmlFor = `${newPreference.id}`;
      newPreferenceLabel.textContent = feedPreferenceList[i].display_name;
      //Append the input with label to the list of feedPreferences
      appendElement.appendChild(newPreferenceLabel);
      appendElement.appendChild(newPreference);
    }
  }
}