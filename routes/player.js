var router = require('express').Router();
var player = require('../player');

router.get('/library', function (req, res, next) {
  player.getLibrary(function (err, tracks) {
    if (err) return next(err);
    res.json(tracks);
  });
});


router.get('/status', function (req, res, next) {
  player.status(function (err, status){
    if (err) return next(err);
    res.json(status);
  })
})

//Use play if mpd status is "stop" - returns mpd status
router.get('/play', function (req, res, next) {
  player.play(function (err, msg) {
    if (err) return next(err);
    player.status(function (err, msg) {
      if (err) return next(err);
      res.json(msg);
    });
  });
});

router.param('arg', function (req, res, next, id) {
  next();
});

//Toggle pause/play - returns mpd status
router.get('/pause/:arg', function (req, res, next) {
  player.pause(req.params.arg, function (err){
    if (err) return next(err);
    player.status(function (err, msg) {
      if (err) return next(err);
      res.json(msg);
    });
  })
});

router.get('/next', function (req, res, next) {
  player.nextSong(function (err) {
    if (err) return next(err);
    player.status(function (err, msg) {
      if (err) return next(err);
      res.json(msg);
    });
  });
});

router.get('/prev', function (req, res, next) {
  player.previousSong(function (err) {
    if (err) return next(err);
    player.status(function (err, msg) {
      if (err) return next(err);
      res.json(msg);
    });
  });
});

//Clear current playlist - returns mpd status
router.get('/plclear', function (req, res, next) {
  player.clearPlaylist(function (err) {
    if (err) return next(err);
    player.status(function (err, msg) {
      if (err) return next(err);
      res.json(msg);
    });
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



module.exports = router;
