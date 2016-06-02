module.exports = {
  port: 3000,
  logFormat: 'dev',
  mpd: {
    connection: {
      host: 'localhost', 
      port: 6600
    }
  },
  gpio: {
    playPin: 27,
    previousPin: 10,
    nextPin: 22,
    statusPin: 24
  }
};
