#include <Arduino.h>
#include "ButtonController.h"

const int redPin = 14;
const int yellowPin = 26;
const int greenPin = 13;
const int bluePin = 25;

ButtonController obj(redPin, yellowPin, greenPin, bluePin);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println("Stareted");
}

void loop() {
  // put your main code here, to run repeatedly:
  obj.loop();
  delay(10);
}
