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

exports.status = function (next) {
  client.sendCommand(mpd.cmd('status', []), function (err, msg) {
    if (err) return next(err);
    next(null, mpd.parseArrayMessage(msg));
  });
};

exports.play = function (next) {
  client.sendCommand(mpd.cmd('play', []), function (err, msg) {
    if (err) return next(err);
    next(null, msg);
  });
};

//Toggles pause/resumes playing, PAUSE is 0 or 1.
exports.pause = function(PAUSE, next) {
  client.sendCommand(mpd.cmd('pause', [PAUSE]), function(err, msg) {
    if (err) return next(err);
    next(null, msg);
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

exports.clearPlaylist = function () {
  client.sendCommand(mpd.cmd('clear', []), function (err,msg) {
    if (err) return next(err);
    console.log(msg);
  });
};

//Add all songs in library to current playlist
exports.addAllSongs = function (next) {
  client.sendCommand(mpd.cmd('add', ['/']), function (err, msg) {
    if (err) return next(err);
    console.log(msg);
  });
}

//Get songs in current playlist
exports.getPlaylist = function (next) {
  client.sendCommand(mpd.cmd('playlistinfo', []), function (err, msg) {
    if (err) return next(err);
    var results = [];
    var obj = {};
    msg.split('\n').forEach(function (p) {
      if (p.length === 0) {
        return;
      }
      var keyValue = p.match(/([^ ]+): (.*)/);
            
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
