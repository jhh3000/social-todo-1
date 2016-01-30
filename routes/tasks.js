var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var sess = req.session;
	var user = sess.user;
	res.render('dashboard', {
		title: 'CPSC113 Todo | Dashboard',
  		f_name: user.fl_name.split(' ')[0]
	});
});

module.exports = router;
