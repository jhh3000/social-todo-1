var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'CPSC113 Todo',
		error: req.flash('error')
	});
	return;
});

module.exports = router;
