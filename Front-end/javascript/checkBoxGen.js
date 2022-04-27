'use strict';

const foodUrl = 'https://localhost:3000';

// Generating the checkbox lists
const generateCheckBoxList = async (appendList, wantedType) => {
  // Fetch the list of feedPreferences
  const response = await fetch(foodUrl + '/food/');
  const feedPreferenceList = await response.json();

  for (let i = 0; i<feedPreferenceList.length; i++) {
    // Generate only the preferences of wanted type
    if (feedPreferenceList[i].type === wantedType) {
      //Create input element
      const newPreference= document.createElement('input');
      newPreference.id = feedPreferenceList[i].name;
      newPreference.type = "checkbox";
      newPreference.name = feedPreferenceList[i].name;
      //Create label for input
      const newPreferenceLabel = document.createElement('label');
      newPreferenceLabel.htmlFor = `${newPreference.id}`;
      newPreferenceLabel.textContent = feedPreferenceList[i].display_name;

      //Append the input with label to the list of feedPreferences
      const li = document.createElement('li');
      li.appendChild(newPreference);
      li.appendChild(newPreferenceLabel);
      appendList.appendChild(li);
    }
  }
}