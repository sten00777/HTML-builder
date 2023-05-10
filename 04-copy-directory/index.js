const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

function copyDir() {
  fsp.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, (err) => {
    if (err) throw err;
  });
  fsp.readdir(path.join(__dirname, 'files'), {withFileTypes: true}, (err) => {
    if (err) throw err;}).then(data => {
    data.forEach(elem => {
      fs.copyFile(path.join(__dirname, 'files', elem.name), path.join(__dirname, 'files-copy', elem.name), (err) => {
        if (err) throw err;});
    });
  });
}


fsp.rm(path.join(__dirname, 'files-copy'), {recursive: true, force: true}, (err) => {
  if (err) console.log('создаю папку "files-copy"');
}).finally(copyDir);