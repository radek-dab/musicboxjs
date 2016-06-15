var ws = require('ws');
var _ = require('lodash');
var player = require('./player');

var clients = [];

exports.listen = function(server) {
  var wss = new ws.Server({server: server});
  wss.on('connection', function(client) {
    clients.push(client);
    client.on('close', function() {
      _.remove(clients, client);
    });
  });
};

function broadcastEvent(eve, msg) {
  var json = JSON.stringify({event: eve, data: msg});
  clients.forEach(function(client) {
    client.send(json);
  });
};

player.on('status', function () {
  player.status(function (err, msg) {
    if (err) broadcastEvent('status', err);
    else broadcastEvent('status', msg);
  });
});

player.on('playlist', function () {
  player.getPlaylist(function (err, msg) {
    if (err) broadcastEvent('playlist', err);
    else broadcastEvent('playlist', msg);
  });  
  player.status(function (err, msg) {
    if (err) broadcastEvent('status', err);
    else broadcastEvent('status', msg);
  });
});
