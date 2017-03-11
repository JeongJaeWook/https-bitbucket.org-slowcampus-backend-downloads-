/*
아두이노 위에서 동작하는 소스 코드.
C 언어 스타일임.

@copyright 슬로우캠퍼스
2017/03/01
*/
#include <SHT1x.h>
#define dataPin  10
#define clockPin 11


int pin_MQ_3 = 0;
int pin_MQ_4 = 1;
int pin_MQ_5 = 2;
int pin_MQ_7 = 3;
int pin_Dust = 8;

unsigned long duration;
unsigned long starttime;
unsigned long sampletime_ms = 30000;//sampe 30s ;
unsigned long lowpulseoccupancy = 0;
float ratio = 0;
float concentration = 0;
float pcsPerCF = 0;
float ugm3 = 0;


SHT1x sht1x(dataPin, clockPin);

class JsonString
{
  public:
    JsonString() {}
    int add(String _key, String _val) {
      _str += "\"" + _key + "\":" + "\"" + _val + "\"";
    }
    int add(String _key, int _val) {
      _str += "\"" + _key + "\":"  + _val;
    }
    int add(String _key, float _val) {
      _str += "\"" + _key + "\":" +  _val;
    }
    int comma() {
      _str += " , ";
    }
    String str() {
      return _str + " } ";
    }
  private:
    String _str = "{ ";
};

/* 아두이노에 연결된 센서들과의 I/O 준비하는 명령
*/
void setup() {
  
  pinMode(pin_MQ_3, INPUT);
  pinMode(pin_MQ_4, INPUT);
  pinMode(pin_MQ_5, INPUT);
  pinMode(pin_MQ_7, INPUT);
  pinMode(pin_Dust, INPUT);

  Serial.begin(9600);
  starttime = millis();
}

/*
메인 루프.
센서들로부터 들어오는 센서 데이터를 읽어서 JSON 형태로 출력함
*/
void loop() {
  String str;
  float temp_c;
  float temp_f;
  float humidity;
  JsonString  json_string = JsonString();

  // Read Dust Sensor Data
  duration = pulseIn(pin_Dust, LOW);
  lowpulseoccupancy = lowpulseoccupancy + duration;

  if ((millis() - starttime) > sampletime_ms) //if the sampel time 
  {
    ratio = lowpulseoccupancy / (sampletime_ms * 10.0); // Integer percentage 0=>100
    concentration = 1.1 * pow(ratio, 3) - 3.8 * pow(ratio, 2) + 520 * ratio + 0.62; // using spec sheet curve
    pcsPerCF = concentration * 100;
    ugm3 = pcsPerCF / 7000;
    json_string.add("DUST", ugm3);
    json_string.comma();
    lowpulseoccupancy = 0;
    starttime = millis();
  }
  
 
  json_string.add("MQ_3", analogRead(pin_MQ_3));
  json_string.comma();

  json_string.add("MQ_4", analogRead(pin_MQ_4));
  json_string.comma();
  
  json_string.add("MQ_5", analogRead(pin_MQ_5));
  json_string.comma();

  json_string.add("MQ_7", analogRead(pin_MQ_7));
  json_string.comma();

  // Read values from the sensor
  temp_c = sht1x.readTemperatureC();
  temp_f = sht1x.readTemperatureF();
  humidity = sht1x.readHumidity();

  json_string.add("TEMP", temp_c);
  json_string.comma();

  json_string.add("HUM", humidity);

  /* 시리얼 통신으로 JSON 형태의 문자열을 송신함 */
  Serial.println(json_string.str());

}

