var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var myutils = require('./helpers/myutils');
var passport = require('./middlewares/auth');
var config = require('config');
var log4js = require('log4js');
var app = express();
var logger = log4js.getLogger();


/**
 * session setting
 */
app.use(session({
  secret: 'fin2b',
  resave: false ,
  saveUninitialized: true ,
  cookie: {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    maxAge: + 30 * 24 * 60 * 60 * 1000,
    secure:false
  }
}));


/**
 * view engine setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//handlebars 관련 layout 설정 (defalut 설정은 layout.hbs)
//http://stackoverflow.com/questions/26871522/how-to-change-default-layout-in-express-using-handlebars
app.set('view options', { layout: false });


/**
 * favicon setting
 */
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


/**
 * express setting
 */
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//첫번째 파라미터를 설정하지 않으면 public 경로를 생략하고 static file을 serving할 수 있음
app.use('/public', express.static(path.join(__dirname, 'public')));


/**
 * security setting
 * http://expressjs.com/ko/advanced/best-practice-security.html
 */
// app.use(helmet());
// or
app.disable('x-powered-by');


/**
 * restful setting
 */
// put, delete method 처리에 필요
// app.use(methodOverride());
// CORS 헤더 설정
// app.all('/*', function(req, res, next) {
//   console.log('CORS Setting..');
//   // CORS headers
//   res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   // Set custom headers for CORS
//   res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
//   res.header('Access-Control-Allow-Credentials', true);
//   if (req.method == 'OPTIONS') {
//     res.status(200).end();
//   } else {
//     next();
//   }
// });


/**
 * custom middlewares
 */
app.use(passport.initialize());
app.use(passport.session());
app.use(/.*/, function(req, res, next) {
  logger.debug('[Session]', req.session.passport);
  logger.debug(myutils.fullUrl(req));
  res.send('Time to go home');
  next();
});


/**
 * controllers
 */
var index = require('./controllers/index');
var adminHome = require('./controllers/admin/home');
var investorHome = require('./controllers/investor/home');
var posts = require('./controllers/common/posts');


/**
 * primary app routes
 */
app.use('/', index);
app.use('/admin', adminHome);
app.use('/investor', investorHome);
app.use('/posts', posts);


/**
 * error handling
 */
app.get('/healthcheck', function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.send('Server is OK !');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found Hahaha');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'production') ? {} : err
  });
});


logger.debug(config.get('server.environment'));
module.exports = app;