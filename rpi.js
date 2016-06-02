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
      player.status(function(err, status) {
        if (status.state == 'play')
          player.pause(1);
        else
          player.pause(0);
      });
      break;

    case config.gpio.previousPin:
      player.previousSong();
      break;

    case config.gpio.nextPin:
      player.nextSong();
      break;
  }
});

var interval = null;

player.on('status', function() {
  player.status(function(err, status) {
    switch (status.state) {
      case 'play':
        if (interval !== null) {
          clearInterval(interval);
          interval = null;
        }
        gpio.write(config.gpio.statusPin, true);
        break;

      case 'pause':
        var value = true;
        interval = setInterval(function() {
          gpio.write(config.gpio.statusPin, value);
          value = !value;
        }, config.gpio.flashTime);
        break;

      case 'stop':
        if (interval !== null) {
          clearInterval(interval);
          interval = null;
        }
        gpio.write(config.gpio.statusPin, false);
        break;
    }
  });
});
