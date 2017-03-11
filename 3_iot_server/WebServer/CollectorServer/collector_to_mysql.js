var mqtt    = require('mqtt');
var http    = require('http');
var mysqlDao = require('../helpers/mysqlDao');
// DB tables
var userTab = new mysqlDao.MySqlDao('slow', 'user', ['id'], []);
var s1Tab = new mysqlDao.MySqlDao('slow', 'sensor1', ['seq'], []);
var s2Tab = new mysqlDao.MySqlDao('slow', 'sensor2', ['seq'], []);
var s3Tab = new mysqlDao.MySqlDao('slow', 'sensor3', ['seq'], []);
var s4Tab = new mysqlDao.MySqlDao('slow', 'sensor4', ['seq'], []);
var s5Tab = new mysqlDao.MySqlDao('slow', 'sensor5', ['seq'], []);

s1Tab.add({value: 10});

var sensorname_to_table = {
  'sensor1': s1Tab,
  'sensor2': s2Tab,
  sensor3: s3Tab,
  sensor4: s4Tab,
  sensor5: s5Tab
};

var mqtt_client  = mqtt.connect('mqtt://localhost');

//mqtt 클라이언트 연결, 연결되면 subscribe
mqtt_client.on('connect', function () {
  console.log('mqtt subscriber has connected to BROKER SERVER');

	mqtt_client.subscribe("sensor1");
	mqtt_client.subscribe('sensor2');
	mqtt_client.subscribe('sensor3');
	mqtt_client.subscribe('sensor4');
	mqtt_client.subscribe('sensor5');

  mqtt_client.on('message',function(topic, message) {
    //var parsed_messsage = JSON.parse(message);
    console.log(topic, message.toString());
    var table = sensorname_to_table[topic];
    var data = {
      value: message.toString()
    }


    table.add(data, function(err, result) {
      if (!err) {
        console.log('OK');
      } else {
        console.log('FAIL');
      }
    });

  });

});
 

