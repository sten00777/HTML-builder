const fs = require('fs');
const path = require('path');
const {stdin, stdout} = process;

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, data) => {
  data.forEach(elem => {
    if (elem.isFile()) {
      fs.readFile(path.join(__dirname, 'secret-folder', elem.name), 'utf-8', (err, file) => {
        fs.stat(path.join(__dirname, 'secret-folder', elem.name), (err, inf) =>  {
          stdout.write(`${path.basename(elem.name).split('.')[0]} - ${path.extname(elem.name).slice(1)} - ${inf.size}B\n`);
        })
      })
    }
  })
});