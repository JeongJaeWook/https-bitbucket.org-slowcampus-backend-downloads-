var express = require('express');
var router = express.Router();
var passport = require('../middlewares/auth');
var log4js = require('log4js');
var logger = log4js.getLogger();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.user){
    res.render('index', { title: 'SLOW CAMPUS Seed Project!' });
  }else {
    res.redirect('/'+req.user.role);
  }
});

router.post('/login', function(req, res, next) {
  logger.debug("request info : "+req.body.email);

  passport.authenticate('local', function(err, user, info) {
    logger.debug("user : " + user);
    if (err) { return next(err); }

    if (!user) {
      return res.status(401).send(info.message);
    }

    req.logIn(user, function(err) {
      if (err) { return next(err); }
      logger.debug('login success :', user);

      if(user.role === 'admin'){
        res.redirect('/admin');
      }else if(user.role === 'investor'){
        res.redirect('/investor');
      }
    });
  })(req, res, next);
});

// logout 함수로 req.user 를 삭제하고 관련 login session을 비움
router.get('/logout', function(req, res){
 req.logout();
 res.redirect('/');
});

module.exports = router;
