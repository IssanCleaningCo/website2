const sharp = require('sharp');
const path = require('path');

// Convert Facebook icon
sharp('img/contact/fb.png')
  .webp()
  .toFile('img/contact/fb.webp')
  .then(info => { console.log('Facebook icon converted:', info); })
  .catch(err => { console.error('Error converting Facebook icon:', err); });

// Convert Instagram icon
sharp('img/contact/ig.jpeg')
  .webp()
  .toFile('img/contact/ig.webp')
  .then(info => { console.log('Instagram icon converted:', info); })
  .catch(err => { console.error('Error converting Instagram icon:', err); }); 