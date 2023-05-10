const fs = require('fs');
const path = require('path');
const fsp = require('fs/promises');

async function createFolders() {
  await fsp.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}).catch((err) => {
    if (err) console.log(err);
  })
  await fsp.mkdir(path.join(__dirname, 'project-dist', 'assets'), {recursive: true}).catch((err) => {
    if (err) console.log(err);
  });
}

let currentDir = path.join(__dirname, 'assets');
let cloneDir = path.join(__dirname, 'project-dist', 'assets');

async function copyFiles(pathToFile, pathToCopy) {
  await fsp.readdir(path.join(pathToFile), {withFileTypes: true}).then(async (files)=> {
    for (let file of files) {
      if (file.isDirectory()) {
        await fsp.mkdir(path.join(pathToCopy, file.name), {recursive: true}).catch((err) => {
          if (err) console.log(err);
        });
        await copyFiles(path.join(pathToFile, file.name), path.join(pathToCopy, file.name)).catch((err) => {
          if (err) console.log(err);
        });
      } else if (file.isFile()){
        await fsp.copyFile(path.join(pathToFile, file.name), path.join(pathToCopy, file.name)).catch((err) => {
          if (err) console.log(err);
        });
      }
    }
  }).catch((err) => {
    if (err) console.log(err);
  })
}

async function removeDistDir() {
  await fsp.rm(path.join(__dirname, 'project-dist'), {recursive: true}).then(async ()=>{
    await createFolders();
  }).catch( async (err) => {
    if (err) console.log('Folder is not exist');
    await createFolders();
  });
}

async function mergeStyles () {
  await fsp.readdir(path.join(__dirname, 'styles')).then(async (files)=> {
    files.forEach(file => {
      if (file.split('.')[1] === 'css') {
        const input = fs.createReadStream(path.join(__dirname, 'styles', file), 'utf-8');
        input.on('data', async chunk => await fsp.appendFile(path.join(__dirname, 'project-dist', 'style.css'), chunk));
      }
    })
  }).catch((err) => {
    if (err) console.log(err);
  });
}

async function buildHtml() {
  let htmlTemplate = await fsp.readFile(path.join(__dirname, 'template.html'), 'utf-8');
  const components = htmlTemplate.matchAll(/{{(.*?)}}/g);
  for (let comp of components) {
    const componentName = comp[1];
    const htmlComponent = await fsp.readFile(path.join(__dirname, 'components', `${componentName}.html`), 'utf8');
    htmlTemplate = htmlTemplate.replace(comp[0], htmlComponent);
  }
  await fsp.writeFile(path.join(__dirname, 'project-dist', 'index.html'), htmlTemplate);
}

async function executeAll() {
  await removeDistDir();
  await copyFiles(currentDir, cloneDir);
  await mergeStyles();
  await buildHtml();
}

executeAll();