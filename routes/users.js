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
        	var sess = req.session;
        	sess.user = user;
    		res.redirect("/task");
    		return;
		}
		req.flash('error', 'Invalid password');
        res.redirect('/');
        return;
    });

})

router.get('/logout', function(req, res, next) {

	var sess = req.session;
    if (sess.user) {
    	sess.user = null;
    }
	res.redirect('/');

})

router.post('/register', function(req, res, next) {

	var collection = req.db.get('usercollection');

	var fl_name = req.body.fl_name;
	var email = req.body.email;
	var password = req.body.password;
	var error = false;

	if (fl_name.length < 1) {
		req.flash('error', 'Name is too short');
		error = true;
	}
	if (fl_name.length > 50) {
		req.flash('error', 'Name is too long');
		error = true;
	}
	if (email.length < 1) {
		req.flash('error', 'Email is too short');
		error = true;
	}
	if (email.length > 50) {
		req.flash('error', 'Email is too long');
		error = true;
	}
	if (email.toLowerCase().match("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$.")) {
		req.flash('error', 'Email format needs to be example@gmail.com');
		error = true;
	}
	if (password.length < 1) {
		req.flash('error', 'Password is too short');
		error = true;
	}
	if (password.length > 50) {
		req.flash('error', 'Password is too long');
		error = true;
	}

	if (error) {
		res.redirect("/");
		return;
	}

	collection.count({ "email": email },function(e, count) {
		if (count > 0) {
			req.flash('error', 'Account with this email already exists!');
			res.redirect("/");
			return;
		}

		collection.insert({
			"fl_name": fl_name,
			"email": email,
			"password": crypto.createHash('md5').update(password).digest("hex")
		}, function (err, doc) {
	        if (err) {
	            res.send(err);
	            return;
	        }
	        else {
	            var sess = req.session;
	        	sess.user = doc;
	    		res.redirect("/task");
	            return;
	        }
	    });
    });

})

module.exports = router;
