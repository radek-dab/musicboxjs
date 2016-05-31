var mpd = require('mpd');
var config = require('./config');

var client = mpd.connect(config.mpd.connection);
client.on('connect', function() {
  console.log('Connected to MPD server');
});
client.on('ready', function() {
  console.log('MPD server is ready to accept commands');
});

exports.play = function() {
  client,sendCommand(mpd.cmd('play', []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
};

exports.pause = function() {
  // TODO: pause w/o value is deprecated.
  client,sendCommand(mpd.cmd('pause', []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
};
