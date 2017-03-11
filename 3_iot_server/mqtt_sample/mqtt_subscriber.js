var mqtt    = require('mqtt');
//var mqtt_client  = mqtt.connect('mqtt://test.mosquitto.org');
var mqtt_client  = mqtt.connect('mqtt://localhost');

mqtt_client.on('message',function(topic, message) {
    console.log(topic + ' : ' + message);
});

//mqtt 클라이언트 연결, 연결되면 subscribe
mqtt_client.on('connect', function () {
  mqtt_client.subscribe("AAAA");
  console.log('mqtt subscriber has connected to BROKER SERVER');
});
 

