var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://localhost');
//var client = mqtt.connect('mqtt://test.mosquitto.org')

mqtt_publisher.on('connect', function(){
  console.log('mqtt publisher connected to BROKER SERVER');
  for(var i=1; i<6; i++) {
    setTimeout(function () {
      var mesg = 'hihi ' + i;
      mqtt_publisher.publish('AAAA', mesg);
      console.log(mesg);
    }, 1000*i);
  }
});

