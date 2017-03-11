var mqtt = require('mqtt');
// var sleep = require('sleep');
// var mqtt_publisher = mqtt.connect('mqtt://test.mosquitto.org');

var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var serialPort = new SerialPort("/dev/cu.usbmodem1421", {
	baudRate: 115200, 
	parser: serialport.parsers.readline('\n')
});

var mqtt_publisher = mqtt.connect('mqtt://1.234.65.181');
//var mqtt_publisher = mqtt.createClient(1883,'1.234.65.181');

serialPort.on("open", function () {
	console.log('open');
	serialPort.on('data', function (data) {
		
	var json_data;
	try {
		json_data = JSON.parse(data);
		//console.log(json_data);
		for(var i in json_data) {
			var temp = [
				getEpochTime(),
				json_data[i]
			];
			temp = JSON.stringify(temp);
			mqtt_publisher.publish(i, temp);
			console.log(i + " : " +temp);
		}
	}catch(err) {
		console.log("Trash Values processed");
	}
	 
	//console.log(data);
	//console.log(json_data);
	// json_data.forEach(function(err,item){
	// 	if(!err)
	// 		console.log(item);
	// })
	// for(var key in json_data){
	// 	console.log(json_data(key));
	// 	//mqtt_publisher.publish(key,json_data[key]);
	// };
		//console.log('data received: ' + data);
		//mqtt_publisher.publish('MQ_3', data.toString());
	});
});



mqtt_publisher.on('connect', function() {
	console.log('mqtt publisher connected to BROKER SERVER');
	mqtt_publisher.subscribe('cmndFromSvr');
	
	mqtt_publisher.on('message', function (topic, message) {
		console.log(topic + " : " + message);
		var parsed_message = JSON.parse(message);
		switch(parsed_message.actuator) {
			case 'LED' :
				if(parsed_message.cmd.toString() == 'TURNON') {
					serialPort.write('0');
					//console.log(0);
				}else {
					serialPort.write('1');
					//console.log(1);
				}
				console.log(parsed_message.actuator + " : " + parsed_message.cmd);
				break;
			case 'PIEZO' :
				if(parsed_message.cmd.toString() == 'SOUND') {
					serialPort.write('3');
					//console.log(3);
				}
				break;
		}
		//serialport.write(parsed_message.actuator);
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
