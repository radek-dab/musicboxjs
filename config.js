module.exports = {
  port: 3000,
  logFormat: 'dev',
  mpd: {
    connection: {
      host: 'localhost',
      port: 6600
    }
  },
  musicPath: '',
  gpio: {
    playPin: 13,
    previousPin: 19,
    nextPin: 15,
    statusPin: 18,
    flashTime: 500,
    lockTime: 500
  }
};
