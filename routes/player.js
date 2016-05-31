var router = require('express').Router();
var player = require('../player');

router.get('/library', function(req, res, next) {
  player.getLibrary(function(err, tracks) {
    if (err) return next(err);
    res.json(tracks);
  });
});

module.exports = router;
