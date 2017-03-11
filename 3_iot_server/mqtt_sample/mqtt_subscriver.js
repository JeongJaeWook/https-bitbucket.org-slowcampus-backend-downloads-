var mqtt    = require('mqtt');
var redis   = require('redis');
//var redis_client = redis.createClient(6379,'1.234.65.181');
//var mqtt_client  = mqtt.connect('mqtt://test.mosquitto.org');


var mqtt_client  = mqtt.connect('mqtt://localhost');
//var mqtt_client  = mqtt.connect('mqtt://1.234.65.181');
//var mqtt_client = mqtt.createClient(1883, '1.234.65.181');
//레디스 연결
/*
redis_client.on('connect', function(){
  console.log('Conneted to Redis');
});
*/


  mqtt_client.on('message',function(topic, message){
    console.log(topic + ' : ' + message);
    //redis_client.lpush(topic.toString(),message);
  });
//mqtt 클라이언트 연결, 연결되면 subscribe
mqtt_client.on('connect', function () {
  mqtt_client.subscribe("AAAA");

  console.log('mqtt subscriber has connected to BROKER SERVER');
});
 

