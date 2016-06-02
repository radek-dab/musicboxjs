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

function broadcastEvent(eve) {
  var json = JSON.stringify({event: eve});
  clients.forEach(function(client) {
    client.send(json);
  });
};

player.on('status', function() {
  broadcastEvent('status');
});
