var gpio = require('rpi-gpio');
var config = require('./config');
var player = require('./player');

gpio.setup(config.gpio.playPin, gpio.GPIO_IN, gpio.EDGE_FALLING);
gpio.on('change', function(channel, value) {
  if (channel == config.gpio.playPin) {
    player.pause();
  }
});
