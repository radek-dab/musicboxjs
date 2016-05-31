var mpd = require('mpd');
var _ = require('lodash');
var config = require('./config');

var client = mpd.connect(config.mpd.connection);
client.on('connect', function() {
  console.log('Connected to MPD server');
});
client.on('ready', function() {
  console.log('MPD server is ready to accept commands');
});

exports.play = function() {
  client.sendCommand(mpd.cmd('play', []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
};

exports.pause = function() {
  // TODO: pause w/o value is deprecated.
  client.sendCommand(mpd.cmd('pause', []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
};

exports.getLibrary = function (next) {
  client.sendCommand(mpd.cmd('listallinfo', []), function (err, msg) {
    if (err) return next(err);
    
    var results = [];
    var obj = {};
    
    msg.split('\n').forEach(function (p) {
      if (p.length === 0) {
        return;
      }
      var keyValue = p.match(/([^ ]+): (.*)/);
      
      if (keyValue[1] == 'directory')
        return;
      
      if (obj[keyValue[1]] !== undefined && keyValue[1] == 'file') {
        results.push(obj);
        obj = {};
        obj[keyValue[1]] = keyValue[2];
      }
      else {
        obj[keyValue[1]] = keyValue[2];
      }
    });
    results.push(obj);
    
    next(null, results);
  });
};

exports.getAllFiles = function (next) {
  client.sendCommand(mpd.cmd('list', ['file']), function (err, msg) {
    if (err) return next(err);
    next(null, mpd.parseArrayMessage(msg));
  });
};