var router = require('express').Router();
var player = require('../player');

var sendMpdStatus = function (next, res) {
  player.status(function (err, status) {
    if (err) return next(err);
    res.json(status);
  });  
};

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
router.get('/play', function (req, res, next) {
  player.play(function (err, msg) {
    if (err) return next(err);
    sendMpdStatus(next, res);
  });
});

router.param('arg', function (req, res, next, id) {
  next();
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
