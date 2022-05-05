'use strict';

// Generating the checkbox lists
const generateCheckBoxList = async (appendElement, wantedType) => {
  // Fetch the list of feedPreferences
  const response = await fetch(url + '/food/');
  const feedPreferenceList = await response.json();

  for (const preference in feedPreferenceList) {
    // Generate only the preferences of wanted type
    if (preference.type === wantedType) {
      //Create input element
      const newPreference= document.createElement('input');
      newPreference.id = preference.name;
      newPreference.type = "checkbox";
      newPreference.name = preference.ID;
      //Create label for input
      const newPreferenceLabel = document.createElement('label');
      newPreferenceLabel.htmlFor = `${newPreference.id}`;
      newPreferenceLabel.textContent = preference.display_name;
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

  for (let i = 0; i<feedPreferenceList.length; i++) {
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