var express = require('express');
var morgan = require('morgan');
var lessMiddleware = require('less-middleware');

var config = require('./config');
var player = require('./player');
var websocket = require('./websocket');

if (process.env.NODE_ENV == 'raspberrypi') {
  console.log('Raspberry Pi environment');
  require('./rpi');
}

var app = express();
app.use(morgan(config.logFormat));
app.use(lessMiddleware(__dirname + '/public'))
app.use(express.static(__dirname + '/public'));
app.use('/api', require('./routes/player'));
app.use('/api', require('./routes/upload'));

var server = app.listen(config.port, function() {
  console.log('Server is listening on', config.port);
});
websocket.listen(server);
