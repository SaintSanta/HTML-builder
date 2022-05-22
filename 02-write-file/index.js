const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Howdy! Write some text or whatever...\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') exit();
  output.write(data.toString());
});

process.on('exit', () => stdout.write('Peace out!'));
process.on('SIGINT', exit);
