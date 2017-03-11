#include <PlayMelody.h>



int trig = 2;
int echo = 3;

int PIEZO_PIN = 6;
int fire_pin = 7;
int LED1_PIN = 8;
int LED2_PIN = 9;


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



void setup() {
  pinMode(trig,OUTPUT);
  pinMode(echo,INPUT);

  pinMode(fire_pin,INPUT);
  pinMode(LED1_PIN,OUTPUT);
  pinMode(LED2_PIN,OUTPUT);
  pinMode(PIEZO_PIN,OUTPUT);
  
  Serial.begin(115200);
  // put your setup code here, to run once:

}

void loop() {


  if(Serial.available()>0){
     char temp = Serial.read();
     if(temp == '0'){
       for(int i = 0 ; i < 3 ; i++){
         digitalWrite(LED1_PIN,HIGH);
         digitalWrite(LED2_PIN,HIGH);
         digitalWrite(PIEZO_PIN,HIGH);
         delay(200);
         digitalWrite(LED1_PIN,LOW);
         digitalWrite(LED2_PIN,LOW); 
         digitalWrite(PIEZO_PIN,LOW);
         delay(200);
       }
     }else if(temp == '3'){
      PlayMelody(PIEZO_PIN, "t380r8v12l16a>dv13fav14>dfv15afv14d<av13f8r4v12<a>cv13eav14>cev15aev14c<av13er4<c-c<a+b>d+f+abb+a+bn66a+bn66r2erfrerd+r2rdrerdrc+r>>crdrcr<brarb+rbrarg+rfrerd+rerdrcl64ab>cdefgab>cdev11l16<<ag+abb+b>cdedcc-dc<bg+ag+abb+b>cdedcc-dc<bg+ag+a>ceceafdn70dfn70dfe<ab+ab+eaeg+8ef+gef+g+ag+abb+b>cdedcc-dc<bg+ag+abb+b>cdedcc-dc<bg+ag+a>ceceafdn70dfn70dfe<ab+ab+eaeg+8ef+gef+g+v13ag+abb+b>cdfn70dfed+e8ec<a>cc<aea>ec<a>caeceaecebg+eg+aecebg+eg+aecebg+eg+aecebg+eg+aeg+eaeg+eaeg+eaeg+eaeg+eaeg+eaeg+eaeg+ea8r4.g+8r4.v15ar2.r8");
      PlayMelody(PIEZO_PIN, "04");
      
     }
     Serial.flush();
    
  }else{

    JsonString  json_string = JsonString();

  
    // put your main code here, to run repeatedly:
  
    json_string.add("FIRE",digitalRead(fire_pin));
    

    digitalWrite(trig,HIGH);
    delayMicroseconds(100);
    digitalWrite(trig,LOW);
  
    int distance = pulseIn(echo,HIGH) *17/1000;
    if(distance>0 && distance<1000){
      json_string.comma();
      json_string.add("DISTANCE", distance);
    }
    
    Serial.println(json_string.str());
    
    delay(1000);  
  }

  
}
