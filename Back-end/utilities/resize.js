'use strict';

const sharp = require('sharp');

const makeThumbnail = async (file, thumbname) => {
  await sharp(file)
  .resize(500, 500)
  .png()
  .toFile('thumbnails/' + thumbname);
}

module.exports = {
  makeThumbnail
}
