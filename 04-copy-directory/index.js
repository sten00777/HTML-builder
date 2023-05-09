const fs = require('fs');
const path = require('path');

function copyDir() {
    fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, (err) => {
      if (err) throw err;
  });

  fs.readdir(path.join(__dirname, 'files'), {withFileTypes: true}, (err, data) => {
    data.forEach(elem =>  {
      fs.copyFile(path.join(__dirname, 'files', elem.name), path.join(__dirname, 'files-copy', elem.name), (err) => {
        if (err) throw err})
    });
  })
}
copyDir();