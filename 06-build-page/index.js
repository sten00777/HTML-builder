const fs = require('fs');
const path = require('path');
const fsp = require('fs/promises');

fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, (err) => {
  if (err) console.log(err);
})

fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), {recursive: true}, (err) => {
  if (err) console.log(err);
})

let currentDir = path.join(__dirname, 'assets');
let cloneDir = path.join(__dirname, 'project-dist', 'assets');

function copyFiles(pathToFile, pathToCopy) {
  fsp.readdir(path.join(pathToFile), {withFileTypes: true}, (err) => {if (err) console.log(err);}).then((files)=> {
    for (let file of files) {
      if (file.isDirectory()) {
        fs.mkdir(path.join(pathToCopy, file.name), {recursive: true}, (err) => {
          if (err) console.log(err);
        })
        copyFiles(path.join(pathToFile, file.name), path.join(pathToCopy, file.name));
      } else if (file.isFile()){
        fs.copyFile(path.join(pathToFile, file.name), path.join(pathToCopy, file.name), (err) => {if (err) console.log(err)})
      }
    }
  })
}
copyFiles(currentDir, cloneDir);


function mergeStyles () {
  fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
    if(err) console.log(err);
    files.forEach(file => {
      if (file.split('.')[1] === 'css') {
        const input = fs.createReadStream(path.join(__dirname, 'styles', file), 'utf-8');
        const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
        input.on('data', chunk => fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), chunk, (err) => {
          if (err) console.log(err);
        }));
      }
  })})
}
mergeStyles ();

function buildHtml() {
  const readStreamTemplate = fs.createReadStream(path.join(__dirname, 'template.html'));
  let htmlTemplate = '';

  readStreamTemplate.on('data', (chunk) => {
    htmlTemplate += chunk.toString();
    fsp.appendFile(path.join(__dirname, 'project-dist', 'index.html'), chunk, (err) => {
      if (err) console.log(err);
    });
  });

  fs.readdir(path.join(__dirname, 'components'), (err, files) => {
    if(err) console.log(err);
    files.forEach(file => {
    fs.readFile(path.join(__dirname, 'components', file), 'utf-8', (err, text) => {
      if (err) console.log(err);
      htmlTemplate = htmlTemplate.replace(`{{${file.slice(0, file.length - 5)}}}`, text);
      fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), htmlTemplate, (err) => {
        if (err) console.log(err);
      });
    });
  });
  });
}
buildHtml();
