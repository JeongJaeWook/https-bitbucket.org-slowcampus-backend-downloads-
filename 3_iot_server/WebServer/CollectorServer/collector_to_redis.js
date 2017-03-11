var mqtt    = require('mqtt');
var redis   = require('redis');
var http    = require('http');

var redis_client = redis.createClient(6379,'localhost');
var mqtt_client  = mqtt.connect('mqtt://localhost');


//http 요청을 위한 option
var options = {
  host: '127.0.0.1',
  path: '/api/setui',
  port: '8080',
  method: 'POST'
};

function readJSONResponse(response) {
  var responseData = '';
  response.on('data', function (chunk) {
    responseData += chunk;
  });
  response.on('end', function () {
    var dataObj = JSON.parse(responseData);
    console.log("Raw Response: " +responseData);
    console.log("Message: " + dataObj.message);
    console.log("Question: " + dataObj.question);
  });
}

//레디스 연결
redis_client.on('connect', function(){
  console.log('Conneted to Redis');
});

//mqtt 클라이언트 연결, 연결되면 subscribe
mqtt_client.on('connect', function () {
  //씨앗방 공기 측정
	mqtt_client.subscribe("DUST");
	mqtt_client.subscribe('MQ_3');
	mqtt_client.subscribe('MQ_4');
	mqtt_client.subscribe('MQ_5');
	mqtt_client.subscribe('MQ_7');
	mqtt_client.subscribe('TEMP');
	mqtt_client.subscribe('HUM');

	mqtt_client.subscribe('FIRE');
	mqtt_client.subscribe('DISTANCE');


  // e-health
	//심박수
	mqtt_client.subscribe('BPM');

	//산소포화도도
	mqtt_client.subscribe('SPO2');

	//체온
	mqtt_client.subscribe('BODY_TEMP');

  mqtt_client.on('message',function(topic, message){
    var parsed_messsage = JSON.parse(message);
    console.log(parsed_messsage);
 
    console.log(topic + ' : ' + message);

    var req = http.request(options, readJSONResponse);
    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    req.write('{\"' + topic + '\"' + ':' + '\"' + message + '\"}');
    req.end();
    // req.write('{"name":"Bilbo", "occupation":"Burglar"}');
    


    
        
    // if(topic == 'FIRE' && mssage == '1'){
    if(topic == 'FIRE' ){
    	var data;
    	console.log(message.toString().substr(15,1));

    	if((message.toString()).substr(15,1)=='0'){
			data =  {actuator:'LED', cmd: 'TURNON' };
    	}else if((message.toString()).substr(15,1)=='1'){
    		data =  {actuator:'LED', cmd: 'TURNOFF' };
    	}
    	console.log(data);
    	mqtt_client.publish('cmndFromSvr', JSON.stringify(data));
    }else if(topic == 'DISTANCE'){

    	var data;
    	console.log(message.toString().substr(15,2));

    	if(Number((message.toString()).substr(15,2))<15){
			data =  {actuator:'PIEZO', cmd: 'SOUND' };
			console.log(data);
    		mqtt_client.publish('cmndFromSvr', JSON.stringify(data));
    	}
    	
    }
    redis_client.lpush(topic.toString(),parsed_messsage);
  });

  console.log('mqtt subscriber has connected to BROKER SERVER');
});
 

