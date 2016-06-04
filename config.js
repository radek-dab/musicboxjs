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
    playPin: 13,
    previousPin: 19,
    nextPin: 15,
    statusPin: 18,
    flashTime: 500,
    lockTime: 500
  },
  musicPath: {
    win: 'C:/Users/Marcin/Music',
    rpi: '/www/library/music'
  }
};
