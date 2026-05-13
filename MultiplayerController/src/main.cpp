#include <Arduino.h>
#include "ButtonController/ButtonController.h"
#include "Models/LedModel/Led.h"
#include "LedController/LedController.h"

const int redPin = 39;
const int yellowPin = 34;
const int greenPin = 36;
const int bluePin = 35;


const int led1PinRed = 26;
const int led1PinGreen = 14;
const int led1PinBlue = 25;
const int led1RedChannel = 0;
const int led1GreenChannel = 1;
const int led1BlueChannel = 2;

const int led2PinRed = 21;
const int led2PinGreen = 13;
const int led2PinBlue = 2;
const int led2RedChannel = 3;
const int led2GreenChannel = 4;
const int led2BlueChannel = 5;

ButtonController obj(redPin, yellowPin, greenPin, bluePin);

Led led1(led1PinRed, led1PinGreen, led1PinBlue, led1RedChannel, led1GreenChannel, led1BlueChannel);
Led led2(led2PinRed, led2PinGreen, led2PinBlue, led2RedChannel, led2GreenChannel, led2BlueChannel);

Led leds[] = {
  led1,
  led2
};

LedController ledController(leds, sizeof(leds) / sizeof(leds[0]));

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println("Stareted");

  ledController.setColor(0, Color(255, 0, 0)); // Set LED 1 to red
  ledController.setColor(1, Color(0, 255, 0)); //

}

void loop() {
  // put your main code here, to run repeatedly:
  obj.loop();
  led1.loop();
  //delay(10);
}
