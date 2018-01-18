var express = require('express');
var router = express.Router();
var config = require('config');
var controller = require('../controllers/index');
var streaming = require('../controllers/streaming');
var package = require('../package.json');

router.get('/', async function(req, res, next) {
    var counts = await controller.get_counts(config.buttons);
    res.render('index', { "config": config, "counts": counts, "package": package });
});

streaming.open();

module.exports = router;
