var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

	var sess = req.session;
	var user = sess.user;

	if (!user) {
		res.redirect('/');
		return;
	}

	var collection = req.db.get('tasks');

	collection.find({
		"$or": [
			{ "user": user.email },
			{ "collaborator1": user.email },
			{ "collaborator2": user.email },
			{ "collaborator3": user.email }
		]
	},{},function(e, tasks) {
		res.render('dashboard', {
			title: 'CPSC113 Todo | Dashboard',
	  		f_name: user.fl_name.split(' ')[0],
	  		email: user.email,
	  		taskList: tasks
		});
		return;
    });
});

router.get('/delete/*', function(req, res, next) {
	var id = req.params[0];

	var collection = req.db.get('tasks');

	collection.remove({ "_id": id });

	res.redirect('/task');
});


router.get('/toggle/*', function(req, res, next) {
	var id = req.params[0];

	var collection = req.db.get('tasks');

	collection.find({
		"_id": id
	},{},function(e, task) {
		task = task[0];
		collection.update({
			"_id": id
		},{
			"$set": { "complete": !task.complete }
		}, function (err) {
	        if (err) {
	            res.send(err);
	            return;
	        }
	    });
    });

	res.redirect('/task');
});

router.post('/create', function(req, res, next) {

	var sess = req.session;
	var user = sess.user;

	var collection = req.db.get('tasks');

	var title = req.body.title;
	var description = req.body.description;
	var collaborator1 = req.body.collaborator1;
	var collaborator2 = req.body.collaborator2;
	var collaborator3 = req.body.collaborator3;

	collection.insert({
		"user": user.email,
		"title": title,
		"description": description,
		"collaborator1": collaborator1,
		"collaborator2": collaborator2,
		"collaborator3": collaborator3,
		"complete": false
	}, function (err, doc) {
        if (err) {
            res.send(err);
            return;
        }
        else {
    		res.redirect("/task");
            return;
        }
    });
});

module.exports = router;
