var express = require('express');
var router = express.Router();
var passport = require('../../middlewares/auth');
var adminRole = require('../../enums/roles').admin;
var postModel = require('../../models/Post');

router.get('/', passport.ensureAuthenticated, function (req, res) {
  postModel.search({}, function (err, rows) {
    if (!err) {
      res.render('common/postList', {title: 'post list', posts: rows});
    } else {
      //TODO error 처리 해야 함
      res.send('error');
    }
  });
});

router.get('/detail', passport.ensureAuthenticated, function (req, res) {
  postModel.search({postId: req.query.postId}, function (err, rows) {
    if (!err) {
      res.render('common/postDetail', {post: rows[0]});
    } else {
      //TODO error 처리 해야 함
      res.send('error');
    }
  });
});

router.get('/regist', passport.ensureAuthenticated, function (req, res) {
  res.render('common/postDetail', {});
});

router.post('/regist', passport.ensureAuthenticated, passport.ensureAuthorized(adminRole), function (req, res) {
  res.send('written');
});

router.get('/update', passport.ensureAuthenticated, function (req, res) {
  postModel.search({postId: req.query.postId}, function (err, rows) {
    if (!err) {
      res.render('common/postUpdate', {post: rows[0]});
    } else {
      //TODO error 처리 해야 함
      res.send('error');
    }
  });
});

router.post('/update', passport.ensureAuthenticated, passport.ensureAuthorized(adminRole), function (req, res) {
  res.send('written');
});

router.post('/delete', passport.ensureAuthenticated, passport.ensureAuthorized(adminRole), function (req, res) {
  res.send('written'+req.body.postId);
});

module.exports = router;
