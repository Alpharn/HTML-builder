const fs = require('fs');
const path = require('path');
const readline = require('readline');
const writeStream = fs.createWriteStream(path.join(__dirname, 'output.txt'), { flags: 'a' });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
console.log('Type your text:');
rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Bye!');
    rl.close();
  } else {
    writeStream.write(`${input}\n`);
    console.log('Text added to file');
  }
});
rl.on('SIGINT', () => {
  console.log('Bye!');
  rl.close();
});