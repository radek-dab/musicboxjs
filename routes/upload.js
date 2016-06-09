var router = require('express').Router();
var multer = require('multer');
var config = require('../config');
var player = require('../player');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.musicPath);
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, datetimestamp + ' - ' + file.originalname)
  }
});

var upload = multer({
  storage: storage,
  //fileFilter: function (req, file, cb) {
  //  console.log(file.mimetype);
  //  cb(null, /^audio\//.test(file.mimetype));
  //}
});

router.post('/upload', upload.single('file'), function (req, res, next) {
  console.log(req.file);
  if (!req.file) return res.sendStatus(400); // Bad Request
  player.updateMpd(null, function (err, msg) {
    if (err) return next(err);
    res.sendStatus(201); // Created
  });
});

module.exports = router;
