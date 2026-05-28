#include <Arduino.h>
#include "ButtonController/ButtonController.h"
#include "Models/LedModel/Led.h"
#include "LedController/LedController.h"
#include "MQTTController/MqttController.h"
#include "Manager/Manager.h"

Manager manager;


unsigned long previousMillis = millis();
void setup() {
  Serial.begin(115200);
  Serial.println("Stareted");

  manager.begin();
  
}

void loop() {
  manager.loop();
  /*
  unsigned long thing = 5000 + previousMillis;
  unsigned long otherTime = millis();
  if (thing <= otherTime) {
    previousMillis = millis();
   // mqttController.publishData("test/topic", "Hello from ESP32!");
  }*/
}
