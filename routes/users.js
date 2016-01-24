var express = require('express');
var crypto = require('crypto');
var router = express.Router();

router.post('/login', function(req, res, next) {

	var collection = req.db.get('usercollection');

	collection.find({},{},function(e, users) {
		i = 0;
		user = null;
        for (i; i<users.length; i++) {
        	if (users[i].email === req.body.email) {
        		user = users[i];
        		continue;
        	}
        }
        if (user === null) {
        	req.flash('error', 'Invalid email address');
        	res.redirect('/');
        	return;
        }
        if (user.password === crypto.createHash('md5').update(req.body.password).digest("hex")) {
    		res.redirect("/dashboard");
    		return;
		}
        res.send("NOT AUTHENTICATED");
    });

})

router.post('/register', function(req, res, next) {

	var collection = req.db.get('usercollection');

	collection.insert({
		"fl_name": req.body.fl_name,
		"email": req.body.email,
		"password": crypto.createHash('md5').update(req.body.password).digest("hex")
	}, function (err, doc) {
        if (err) {
            res.send(err);
        }
        else {
            res.redirect("/");
        }
    });

})

module.exports = router;
