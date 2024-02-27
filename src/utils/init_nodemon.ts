import nodemon from 'nodemon';

// Handle normal exits
process.on('exit', code => {
  nodemon.emit('quit');
  process.exit(code);
});

// Handle CTRL+C
process.on('SIGINT', () => {
  nodemon.emit('quit');
  process.exit(0);
});
