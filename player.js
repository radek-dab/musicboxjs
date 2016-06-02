var mpd = require('mpd');
var EventEmitter = require('events').EventEmitter;
var config = require('./config');

// Make player be instance of EventEmitter
module.exports = exports = new EventEmitter();

var client = mpd.connect(config.mpd.connection);
client.on('connect', function() {
  console.log('Connected to MPD server');
});
client.on('ready', function() {
  console.log('MPD server is ready to accept commands');
});
client.on('system-player', function() {
  exports.emit('status');
});

exports.status = function (next) {
  client.sendCommand(mpd.cmd('status', []), function (err, msg) {
    if (err) return next(err);
    next(null, mpd.parseKeyValueMessage(msg));
  });
};

/**
 * Play current song or song specified by ID
 *
 * @method play
 * @param {number} [id] Song ID
 * @param {function} next Callback function
 */
exports.play = function (id, next) {
  if (arguments.length < 2) {
    next = id;
    id = undefined;
  }
  var args = typeof id == 'undefined' ? [] : [id];
  client.sendCommand(mpd.cmd('playid', args), function (err, msg) {
    if (err) return next(err);
    next(null, msg);
  });
};

//Toggles pause/resumes playing, PAUSE is 0 or 1.
exports.pause = function(PAUSE, next) {
  next = next || function() {};
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

exports.clearPlaylist = function (next) {
  client.sendCommand(mpd.cmd('clear', []), function (err,msg) {
    if (err) return next(err);
    next(null, '');
  });
};

//Add all songs in library to current playlist
exports.addAllSongs = function (next) {
  client.sendCommand(mpd.cmd('add', ['/']), function (err, msg) {
    if (err) return next(err);
    next(null, '');
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

exports.nextSong = function (next) {
  next = next || function() {};
  client.sendCommand(mpd.cmd('next', []), function (err, msg) {
    if (err) return next(err);
    next(null, msg);
  });
};

exports.previousSong = function (next) {
  next = next || function() {};
  client.sendCommand(mpd.cmd('previous', []), function (err, msg) {
    if (err) return next(err);
    next(null, msg);
  });
};

exports.shuffle = function (start, end, next){
  var range = [];
  if (Number.isInteger(start) && Number.isInteger(end))
    range.push(start + ':' + end);
  client.sendCommand(mpd.cmd('shuffle', range), function (err, msg) {
    if (err) return next(err);
    next(null, msg);
  });
}
