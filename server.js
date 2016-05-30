var express = require('express');
var morgan = require('morgan');
var lessMiddleware = require('less-middleware');
var Player = require('player');
var config = require('./config');

var app = express();
app.use(morgan(config.logFormat));
app.use(lessMiddleware(__dirname + '/public'))
app.use(express.static(__dirname + '/public'));

var server = app.listen(config.port, function() {
  console.log('Server is listening on', config.port);
});

// Player

player = new Player([
  __dirname + '/music/lazarev.mp3',
  __dirname + '/music/szpak.mp3'
]);

player.on('playing', function(song) {
  console.log(song);
  setTimeout(function() {
    player.progress(song.meta);
  }, 3000);
});

player.play();

if (process.env.NODE_ENV == 'raspberrypi') {
  console.log('Raspberry Pi environment');
  require('./rpi')(player);
}
