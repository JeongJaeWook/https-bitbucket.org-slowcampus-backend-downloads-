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
var redis = require('redis');
var db = redis.createClient(6379, 'localhost', {});
var myutils = require('./routes/myutils');
var router = express.Router();

// route middleware that will happen on every request
router.use(function(req, res, next) {
	console.log('ROUTER USE', req.method, req.url);
	if (req.session.gwlist) {
		console.log('SESS GWID', req.session.gwlist);
		req.session.gwlist = JSON.parse(req.session.gwlist);
	}
	next();
});

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
app.get('/', function (req, res) {
	//res.render('pages/index', { username: req.user });
	res.redirect('/current');
});

var sensors = { 'DUST': 'tag1',
				'MQ_3': 'tag2',
				'MQ_4': 'tag3',
				'MQ_5': 'tag4',
				'FIRE': 'tag5',
				'MQ_7': 'tag6',
				'TEMP': 'tag7',
				'HUM' : 'tag8',
				'DISTANCE': 'tag9' };
var sensornames = Object.keys(sensors);

// current page - air
app.get('/current',  function (req, res) {
	res.render('pages/current2', { sensornames: sensornames });
});

var bodysensors = { 'SPO2': 'tag1',
					'BPM' : 'tag2',
					'BODY_TEMP': 'tag3' };
var bodysensornames = Object.keys(bodysensors);

// current page - body
app.get('/bodychart', function (req, res) {
	res.render('pages/current3', { sensornames: bodysensornames });
});

// Dashboard page
app.get('/dashboard',  function (req, res) {
	res.render('pages/dashbrd',
		{username: req.user, gwid: req.session.gwlist});
});

// chart page
app.get('/chart',  function (req, res) {
	res.render('pages/highchart3', {});
});

// chart page
app.get('/airchart',  function (req, res) {
	res.render('pages/highchart2', {});
});

app.get('/api/getui',  function (req, res) {
	console.log('/api/getui');
});

//// event notification
app.post('/api/setui',  function (req,res){
	var jsonData = "";
  		req.on('data', function (chunk) {
   		jsonData += chunk;
  	});
	req.on('end', function () {
	    var reqObj = JSON.parse(jsonData);
	    for(var i in reqObj) {
	    	var parsed_data = JSON.parse(reqObj[i]);
			ioserv.sockets.in('CURRENT').emit('redraw',
				{ sensorname: i, point: parsed_data });
	    }
	});
});

app.get('/api/current', function (req, res) {
	console.log('/api/current', req.query);
	sensorname = req.query.sensorname;
	db.lindex(sensorname, 0, function (err, data) {
		var rdata = [
			data ? Number(data.substr(0, 13)) : 0,
			//(new Date()).getTime(),
			data ? Number(data.substr(14, 5)) : 0
		];
		res.json(rdata);
	});
});

/// 시간대별 센서 데이터 가져오기
var data1 = require('./routes/data1');
app.get('/api/data1', function (req, res) {
	console.log('/api/data1', req.query);
	res.json(data1.data);
});

var data2 = require('./routes/data2');
app.get('/api/data2', function (req, res) {
	console.log('/api/data2', req.query);
	res.json(data2.data);
});

app.get('/api/random', function (req, res) {
	var rdata = [
		(new Date()).getTime(), // X == Current time
		Math.round(Math.random() * 100)  // Y == random value
	];
	console.log(rdata);
	res.json(rdata);
});

app.get('/api/sensor', function (req, res) {
	console.log('/api/sensor', req.query);
	// sensor 이름 === req.query.sensorname
	// redis에 sensor 이름으로 데이타를 읽어와서 res.json()으로 응답한다.
	sensorname = req.query.sensorname;
	db.lindex(sensorname, 0, function(err, data) {
		var rdata = [
			Number(data.substr(0, 13)),
			Number(data.substr(14, 5))
		];
		res.json(rdata);
	});
});

app.get('/api/many', function (req, res) {
	sensorname = req.query.sensorname;
	db.lrange(sensorname, 0, 19, function(err, data) {
		var rdata = [];
		for(var i=data.length-1; i>=0; i--) {
			rdata.push([
				Number(data[i].substr(0, 13)),
				Number(data[i].substr(14, 5))
			]);
		}
		res.json(rdata);
	});
});

app.post('/noti', function (req, res) {
	console.log('RECV NOTI', req.body);
	// room id === gwid
	ioserv.sockets.in('CURRENT').emit('redraw', 
		{sensorname: "HUM", point: [new Date(), 10.6]});
	res.json({'result':'OK'});
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
