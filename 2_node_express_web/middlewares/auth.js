var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var _ = require('lodash');
var log4js = require('log4js');
var logger = log4js.getLogger();
var userModel = require('../models/User');
//
// var kim = {email : 'kim@fin2b.com', password : '1234', role : 'admin'};
// var lee = {email : 'lee@fin2b.com', password : '2345', role : 'investor'};
// var users = [kim, lee];

function getAccountByEmail(email, cb){
    userModel.search({email : email}, cb);
}

passport.use(new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // 인증콜백함수로 HTTP Request를 그대로 전달 여부
  },
  // 인증콜백함수
  function(req, email, password, done) {
    logger.debug('account : ', email, 'password : ', password);
    getAccountByEmail(email, function (error, users) {
        var user = users[0];
        logger.debug('account from array', user.email, user.password);

        // if (rows.length > 0 && bcrypt.compareSync(password, user.password)) {
        if (userModel.validatePassword(password, user.password)) {
            logger.log('passport auth OK');
            var omittedUser = _.omit(user, ['password'])
            return done(null, omittedUser);
        } else {
            logger.log('passport auth NOT OK');
            return done(null, false, {message : 'Incorrect Information.'});
        }
    });
  } // function
  ) // LocalStrategy
); // use



// 사용자 정보를 session에 저장
passport.serializeUser(function(user, done) {
    logger.log('serializeUser::user account: ' + user);
    done(null, user);
});

// 로그인이 된 상태에서 모든 사용자 페이지 접근 시 호출
passport.deserializeUser(function(user, done) {
    logger.log('deserializeUser::user account : ' + user);
    done(null, user);
});


// 로그인이 되어 있으면, 다음 파이프라인으로 진행
passport.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
    // logger.log('[%s] authenticated!!!', req.user.email);
    console.log('[%s] authenticated!!!', req.user.email);
    return next();
    } else {
        logger.log('not authenticated!!!');
        res.redirect('/');
    }
};

passport.ensureAuthorized = function(requiredRoles) {
    return function(req, res, next) {
        if (req.user && _.includes(requiredRoles, req.user.role) ) {
            // logger.log('[%s] [%s] authorized!!!', req.user.email, req.user.role);
            console.log('[%s] [%s] authorized!!!', req.user.email, req.user.role);
            next();
        } else {
            logger.log('Unauthorized!!!');
            res.redirect('/');
        }
    };
};

module.exports = passport;

