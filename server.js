var express = require('express');
var morgan = require('morgan');
var Player = require('player');
var config = require('./config');
var rpi = require('./rpi');

var app = express();
app.use(morgan(config.logFormat));
app.use(express.static('public'));

var server = app.listen(config.port, function() {
  console.log('Server is listening on', config.port);
});

// Player

player = new Player([
  __dirname + '/music/lazarev.mp3',
  __dirname + '/music/szpak.mp3'
]);
rpi(player);

player.on('playing', function(song) {
  console.log(song);
  setTimeout(function() {
    player.progress(song.meta);
  }, 3000);
});

player.play();
