var gpio = require('rpi-gpio');
var config = require('./config');

module.exports = function(player) {
  gpio.setup(config.gpio.playPin, gpio.GPIO_IN, gpio.EDGE_FALLING);
  gpio.on('change', function(channel, value) {
    if (channel == config.gpio.playPin) {
      player.pause();
    }
  });
};
