var express = require('express');
var router = express.Router();
var passport = require('../../middlewares/auth');
var requiredRoles = require('../../enums/roles').investor;

/* GET home page. */
router.use(passport.ensureAuthenticated, passport.ensureAuthorized(requiredRoles));

router.get('/', function(req, res) {
  res.render('investor/home', { title: 'investor' });
});

module.exports = router;
