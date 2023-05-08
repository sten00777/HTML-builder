const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

process.on('exit', () => stdout.write('Ака’Магош! Держи нос по ветру!\n'));
process.on('SIGINT', () => {
  process.exit();
});

stdout.write('Тром-Ка, путник! Чем могу помочь?\n');
stdin.on('data', content => {
  if (content.toString().trim() === 'exit') {
    process.exit();
  }
  writeStream.write(content);
});

