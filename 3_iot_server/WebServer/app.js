/*
*/
// packages
var express = require('express');
var io = require('socket.io');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var async = require('async');
var mysqlDao = require('./helpers/mysqlDao');
var myutils = require('./routes/myutils');
var router = express.Router();


var app = express();
var ejs = require('ejs'),
	LRU = require('lru-cache');
ejs.cache = LRU(100);

var ioserv = {};
var sensorname;

//// express use
app.use(session({
	secret: 'JJK'
	,resave: false
	,saveUninitialized: true
	//,cookie: { secure: true }
}));
app.use(cookieParser());
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
console.log('dirName : ' + __dirname);
app.set('view engine', 'ejs');		// set the view engine to ejs

//// routing
// route middleware that will happen on every request
app.use(function(req, res, next) {
	console.log('ROUTER USE', req.method, req.url);
	next();
});



var sensors = {
    'sensor1': 'tag1',
    'sensor2': 'tag2',
    'sensor3': 'tag3',
    'sensor4': 'tag4',
    'sensor5': 'tag5'
};
var sensornames = Object.keys(sensors);

// DB tables
var userTab = new mysqlDao.MySqlDao('slow', 'user', ['id'], []);
var s1Tab = new mysqlDao.MySqlDao('slow', 'sensor1', ['seq'], []);
var s2Tab = new mysqlDao.MySqlDao('slow', 'sensor2', ['seq'], []);
var s3Tab = new mysqlDao.MySqlDao('slow', 'sensor3', ['seq'], []);
var s4Tab = new mysqlDao.MySqlDao('slow', 'sensor4', ['seq'], []);
var s5Tab = new mysqlDao.MySqlDao('slow', 'sensor5', ['seq'], []);
var sensorname_to_table = {
  sensor1: s1Tab,
  sensor2: s2Tab,
  sensor3: s3Tab,
  sensor4: s4Tab,
  sensor5: s5Tab
};

// DB read test
function seeit() {
  userTab.all(function(err, rows) {
    if (!err) {
      for(var i=0; i<rows.length; i++) {
        console.log(rows[i]);
      }
    }
  });
}

app.get('/', function (req, res) {
	res.redirect('/current');
});

//
app.get('/current',  function (req, res) {
	res.render('pages/current', { sensornames: sensornames });
});

// chart page
app.get('/chart',  function (req, res) {
	res.render('pages/highchart3', {});
});

// get sensor data
app.get('/api/current', function (req, res) {
	console.log('/api/current', req.query);
	var sensorname = req.query.sensorname;
	console.log('sensorname', sensorname);
	var table = sensorname_to_table[sensorname];
	table.all(function(err, rows) {
	  if (!err) {
      console.log(rows[rows.length-1]);
      res.json(rows[rows.length-1]);
    } else {
      res.json({});
    }
	});
});

app.get('/api/many', function (req, res) {
	var sensorname = req.query.sensorname;
	console.log('sensorname', sensorname);
	var table = sensorname_to_table[sensorname];
	table.all(function(err, rows) {
	  if (!err) {
      console.log('ROWS', rows.length);
      res.json(rows);
    } else {
      res.json({});
    }
	});
});

var data1 = require('./routes/data1');
var data2 = require('./routes/data2');

app.post('/noti', function (req, res) {
	console.log('RECV NOTI', req.body);
	ioserv.sockets.in('CURRENT').emit('redraw',
		{sensorname: req.body.sensorname, point: [new Date(), 10.6]});
	res.json({'result':'OK'});
});



app.get('/api/data1', function (req, res) {
	console.log('/api/data1', req.query);
	res.json(data1.data);
});

app.get('/api/data2', function (req, res) {
	console.log('/api/data2', req.query);
	res.json(data2.data);
});


/// Startup the server
var port = app.get('port');
console.log('port =', port);
var server = http.createServer(app);

// TimeZone 값을 세팅. 실제 서버는 미국시간일 수도 있으므로.
process.env.TZ = 'Asia/Seoul';

server.listen(port, function() {
	console.log('Express server listening on port ' + app.get('port'));
});

/// Start up the socker server - 소켓 서버를 생성 및 실행합니다.

var allClients = [];

ioserv = io.listen(server);
ioserv.sockets.on('connection', function (socket) {
	allClients.push(socket);
	console.log('RECV: NEW CONN', allClients.length);

	// joinroom 이벤트
	socket.on('joinroom', function (roomname) {
		console.log('RECV: joinroom', roomname);
		socket.join(roomname);
	});

	// disconnect 이벤트
	socket.on('disconnect', function () {
		var i = allClients.indexOf(socket);
		delete allClients[i];
		console.log('RECV: disconnect', i, allClients.length);
	});
});
