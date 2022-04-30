'use strict';

// Generating the checkbox lists
const generateCheckBoxList = async (appendElement, wantedType) => {
  // Fetch the list of feedPreferences
  const response = await fetch(url + '/food/');
  const feedPreferenceList = await response.json();

  for (let i = 0; i<feedPreferenceList.length; i++) {
    // Generate only the preferences of wanted type
    if (feedPreferenceList[i].type === wantedType) {
      //Create input element
      const newPreference= document.createElement('input');
      newPreference.id = feedPreferenceList[i].name;
      newPreference.type = "checkbox";
      newPreference.name = feedPreferenceList[i].ID;
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

// Generating the checkbox lists
const generateCheckBoxListForProfileEdit = async (appendElement, wantedType, preCheckList) => {
  // Fetch the list of feedPreferences
  const response = await fetch(url + '/food/');
  const feedPreferenceList = await response.json();

  for (let i = 0; i<feedPreferenceList.length; i++) {
    // Generate only the preferences of wanted type
    if (feedPreferenceList[i].type === wantedType) {
      //Create input element
      const newPreference= document.createElement('input');
      newPreference.id = feedPreferenceList[i].name;
      newPreference.type = "checkbox";
      newPreference.name = feedPreferenceList[i].ID;
      //Check if in preCheckList
      if (preCheckList.includes(newPreference.id)) {
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