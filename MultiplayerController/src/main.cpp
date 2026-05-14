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

const int led3PinRed = 16;
const int led3PinGreen = 17;
const int led3PinBlue = 22;
const int led3RedChannel = 6;
const int led3GreenChannel = 7;
const int led3BlueChannel = 8;

const int led4PinRed = 19;
const int led4PinGreen = 23;
const int led4PinBlue = 18;
const int led4RedChannel = 9;
const int led4GreenChannel = 10;
const int led4BlueChannel = 11;

ButtonController obj(redPin, yellowPin, greenPin, bluePin);

Led led1(led1PinRed, led1PinGreen, led1PinBlue, led1RedChannel, led1GreenChannel, led1BlueChannel);
Led led2(led2PinRed, led2PinGreen, led2PinBlue, led2RedChannel, led2GreenChannel, led2BlueChannel);
Led led3(led3PinRed, led3PinGreen, led3PinBlue, led3RedChannel, led3GreenChannel, led3BlueChannel);
Led led4(led4PinRed, led4PinGreen, led4PinBlue, led4RedChannel, led4GreenChannel, led4BlueChannel);
Led leds[] = {
  led2, // Jeg ved ikke helt hvorfor, men åbenbart skal led2 være først ift. train, da led2 lyser først i trainet, idk why, giver ikke mening.
  led1,
  led3,
  led4
};
//Blink	150-300ms	Lower = faster blinking
//Train	60-150ms	Feels smooth around 100ms
//Fill	80-200ms	Slower looks cleaner
//Pulse	15-30ms	Smooth fade updates
//Rainbow	20-40ms	30ms is usually perfect
//Wave	20-35ms	Depends on LED count
//Breathing	15-25ms	Smooth ambient effect
LedController ledController(leds, sizeof(leds) / sizeof(leds[0]));

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println("Stareted");

 // ledController.startBlink(Color(255, 0, 0), 50, 500);
  ledController.startTrain(Color(0, 255, 0), 250);
}

void loop() {
  // put your main code here, to run repeatedly:
  obj.loop();
  ledController.loop();
  //delay(10);
}
