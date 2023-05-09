const fs = require('fs');
const path = require('path');
let arrOfStyles = [];
fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if(err) console.log(err);
  files.forEach(file => {
    if (file.split('.')[1] === 'css') {
      let arrStyles = [];
      const input = fs.createReadStream(path.join(__dirname, 'styles', file), 'utf-8');
      const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
      input.on('data', chunk => fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), chunk, (err) => {
        if (err) console.log(err);
      }));

    }
  })})
