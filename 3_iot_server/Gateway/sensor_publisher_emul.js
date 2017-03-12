/*
센서데이타를 랜덤으로 생성하여 MQTT서버로 보냄.
MQTT서버의 주소를 확인하여야 함.
*/
var mqtt = require('mqtt');
//var mqtt_publisher = mqtt.connect('mqtt://localhost');
var mqtt_publisher = mqtt.connect('mqtt://lab.slowcampus.com');
// var mqtt_publisher = mqtt.connect('mqtt://test.mosquitto.org');

var sensor_names = [
  'sensor1',
  'sensor2',
  'sensor3',
  'sensor4',
  'sensor5',

];

/*
 json_data 안에 센서 이름별로 값을 담아서 보냄고자 함.
 센서값이 OLD값에서 조금씩 변화하도록 구현함.
*/
var json_data = {};
var old_data = {};
for(var i=0; i<sensor_names.length; i++) {
  json_data[sensor_names[i]] = Math.random() * 10;
  old_data[sensor_names[i]] = 0;
}

function emul_sensor_data() {
	for(var i=0; i<sensor_names.length; i++) {
	  json_data[sensor_names[i]] = old_data[sensor_names[i]] + Math.random() - 0.5;
	  old_data[sensor_names[i]] = json_data[sensor_names[i]];
	}

	try {
		//console.log(json_data);
		for(var sensorname in json_data) {
		  var val = json_data[sensorname].toString();
			mqtt_publisher.publish(sensorname, val);
			console.log(sensorname, val);
		}
	}catch(err) {
		console.log("Trash Values processed");
	}
}

mqtt_publisher.on('connect', function() {
	console.log('mqtt publisher connected to BROKER SERVER');
	//mqtt_publisher.subscribe('cmndFromSvr');
	
	mqtt_publisher.on('message', function (topic, message) {
		console.log(topic + " : " + message);
		var parsed_message = JSON.parse(message);
	});
});

function getEpochTime() {
	var now = new Date();
	//var epochtm = Math.round(now.getTime()/1000.0);
	return now.getTime();
	// var options = {};
	// options.timeZone = 'Asia/Seoul';
	// var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
	// d.setUTCSeconds(epochtm);
	// return d.toLocaleString('ko-KR', options); // time with TimeZone
}

setInterval(emul_sensor_data, 1000);
