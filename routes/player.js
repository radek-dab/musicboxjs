var router = require('express').Router();
var player = require('../player');
var multer = require('multer');
var config = require('./config');
var rpiEnv = process.env.NODE_ENV == 'raspberrypi';

var sendMpdStatus = function (next, res) {
  player.status(function (err, status) {
    if (err) return next(err);
    res.json(status);
  });
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (rpiEnv)
      cb(null, config.musicPath.rpi);
    else
      cb(null, config.musicPath.win);
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, 
      file.fieldname + '-' +
      datetimestamp + '.' + 
      file.originalname.split('.')[file.originalname.split('.').length - 1]
    )
  }
});

var upload = multer({
  storage: storage
}).single('file');

router.post('/upload', function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    console.log(req.file);
    player.updateMpd(null, function (err, msg) {
      if (err) return next(err);
      console.log(msg);
      res.json({ error_code: 0, err_desc: null });
    });
  });
});

router.get('/library', function (req, res, next) {
  player.getLibrary(function (err, tracks) {
    if (err) return next(err);
    res.json(tracks);
  });
});

router.get('/status', function (req, res, next) {
  sendMpdStatus(next, res);
})

//Use play if mpd status is "stop" - returns mpd status
router.get('/play/:id?', function (req, res, next) {
  player.play(req.params.id, function (err, msg) {
    if (err) return next(err);
    sendMpdStatus(next, res);
  });
});

//Toggle pause/play - returns mpd status
router.get('/pause/:arg', function (req, res, next) {
  player.pause(req.params.arg, function (err){
    if (err) return next(err);
    sendMpdStatus(next, res);
  })
});

router.get('/next', function (req, res, next) {
  player.nextSong(function (err) {
    if (err) return next(err);
    sendMpdStatus(next, res);
  });
});

router.get('/prev', function (req, res, next) {
  player.previousSong(function (err) {
    if (err) return next(err);
    sendMpdStatus(next, res);
  });
});

//Clear current playlist - returns mpd status
router.get('/plclear', function (req, res, next) {
  player.clearPlaylist(function (err) {
    if (err) return next(err);
    sendMpdStatus(next, res);
  });
});

//Get current playlist
router.get('/plsongs', function (req, res, next) {
  player.getPlaylist(function (err, songs) {
    if (err) return next(err);
    res.json(songs);
  });
});

//Add all songs in library to current playlist and return the playlist
router.get('/pladdall', function (req, res, next) {
  player.addAllSongs(function (err) {
    if (err) return next(err);
  });
  player.getPlaylist(function (err, songs) {
    if (err) return next(err);
    res.json(songs)
  });
});

//TODO: start and end of shuffling
router.get('/plshuffle', function (req, res, next) {
  player.shuffle(null, null, function (err) {
    if (err) return next(err);
  });
  sendMpdStatus(next, res);
});

module.exports = router;
