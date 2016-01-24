var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'CPSC113 Todo | Dashboard' });
});

module.exports = router;
