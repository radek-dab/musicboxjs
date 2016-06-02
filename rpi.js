var gpio = require('rpi-gpio');
var config = require('./config');
var player = require('./player');

gpio.setup(config.gpio.playPin, gpio.DIR_IN, gpio.EDGE_FALLING);
gpio.setup(config.gpio.previousPin, gpio.DIR_IN, gpio.EDGE_FALLING);
gpio.setup(config.gpio.nextPin, gpio.DIR_IN, gpio.EDGE_FALLING);
gpio.setup(config.gpio.statusPin, gpio.DIR_OUT);

gpio.on('change', function(channel, value) {
  switch (channel) {
    case config.gpio.playPin:
      var status = player.getStatus();
      if (status.state = 'play')
        player.pause(1);
      else
        player.pause(0);
      break;

    case config.gpio.previousPin:
      player.previous();
      break;

    case config.gpio.nextPin:
      player.next();
      break;
  }
});

var interval = null;

player.on('status', function() {
  var status = player.getStatus();

  switch (status.state) {
    case 'play':
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      gpio.write(config.gpio.statusPin, true);
      break;

    case 'pause':
      var value = true;
      setInterval(function() {
        gpio.write(config.gpio.statusPin, value);
        value = !value;
      }, config.gpio.delay);
      break;

    case 'stop':
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      gpio.write(config.gpio.statusPin, false);
      break;
  }
});
