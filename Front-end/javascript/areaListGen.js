'use strict';

//list of areas
const areaList = [
  'Alppiharju',
  'Bodom',
  'Espoon keskus',
  'Espoonkartano',
  'Espoonlahti',
  'Gumböle',
  'Haaga',
  'Haukilahti',
  'Henttaa',
  'Herttoniemi',
  'Högnäs',
  'Iivisniemi',
  'Itä-Pakila',
  'Jakomäki',
  'Järvenperä',
  'Kaarela',
  'Kaitaa',
  'Kalajärvi',
  'Kallio',
  'Kampinmalmi',
  'Karakallio',
  'Karhusuo',
  'Karvasmäki',
  'Kauklahti',
  'Kaupunginkallio',
  'Keilaniemi',
  'Kilo',
  'Kolmperä',
  'Kulosaari',
  'Kunnarla',
  'Kurttila',
  'Kuurinniitty',
  'Laajalahti',
  'Laajasalo',
  'Laaksolahti',
  'Lahnus',
  'Lakisto',
  'Latokartano',
  'Latokaski',
  'Laurinlahti',
  'Lauttasaari',
  'Leppävaara',
  'Lintuvaara',
  'Lippajärvi',
  'Luukki',
  'Länsi-Pakila',
  'Malmi',
  'Mankkaa',
  'Matinkylä',
  'Maunula',
  'Mellunkylä',
  'Munkkiniemi',
  'Muurala',
  'Myllypuro',
  'Niipperi',
  'Niittykumpu',
  'Nupuri',
  'Nuuksio',
  'Nöykkiö',
  'Olari',
  'Otaniemi',
  'Oulunkylä',
  'Pasila',
  'Perusmäki',
  'Pitäjänmäki',
  'Pohjois-Tapiola',
  'Puistola',
  'Pukinmäki',
  'Reijola',
  'Röylä',
  'Saunalahti',
  'Sepänkylä',
  'Siikajärvi',
  'Soukka',
  'Suurpelto',
  'Suutarila',
  'Suvisaaristo',
  'Taka-Töölö',
  'Tapiola',
  'Tuomarinkylä',
  'Ullanlinna',
  'Vallila',
  'Vanha-Nuuksio',
  'Vanhakartano',
  'Vanhakaupunki',
  'Vanttila',
  'Vartiokylä',
  'Velskola',
  'Viherlaakso',
  'Vironniemi',
  'Vuosaari',
  'Westend',
  'Östersundom',
]

// Generating the area options
const generateAreaList = (selectElement) => {
  //Add every location to the selectElement with a label
  for (let i = 0; i<areaList.length; i++) {
    // Create option element
    const option = document.createElement('option');
    option.id = areaList[i];
    option.value = areaList[i];
    option.innerText = areaList[i];
    // Create label for option
    const label = document.createElement('label');
    label.htmlFor = option.id;
    //Append to the selectElement
    selectElement.appendChild(label);
    selectElement.appendChild(option);
  }
}