var router = require('express').Router();
var player = require('../player');

router.get('/library', function(req, res, next) {
  player.getLibrary(function(err, tracks) {
    if (err) return next(err);
    res.json(tracks);
  });
});

router.get('/allsongs', function (req, res, next){
	player.getAllFiles(function (err, files) {
		if (err) return next(err);
		res.json(files);
	});
});

module.exports = router;
