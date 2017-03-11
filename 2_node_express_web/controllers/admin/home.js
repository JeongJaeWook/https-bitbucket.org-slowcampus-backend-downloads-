var express = require('express');
var router = express.Router();
var passport = require('../../middlewares/auth');
var requiredRoles = require('../../enums/roles').admin;

/* GET home page. */
router.use(passport.ensureAuthenticated, passport.ensureAuthorized(requiredRoles));

router.get('/', function(req, res) {
  res.render('admin/home', { title: 'admin' });
});

router.get('/txt', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;
