var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var sess = req.session;
	var user = sess.user;

	if (user) {
		res.redirect('/task');
		return;
	}

	res.render('index', {
		title: 'CPSC113 Todo',
		error: req.flash('error')
	});
	return;
});

module.exports = router;
