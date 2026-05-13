#include <iostream>
#include <Arduino.h>
#include "ButtonController.h"

ButtonController::ButtonController(int redPin, int yellowPin, int greenPin, int bluePin) {
    this->redPin = redPin;
    this->yellowPin = yellowPin;
    this->greenPin = greenPin;
    this->bluePin = bluePin;

    pinMode(redPin, INPUT);
    pinMode(yellowPin, INPUT);
    pinMode(greenPin, INPUT);
    pinMode(bluePin, INPUT); 
}


void ButtonController::loop() {
    bool redState = digitalRead(redPin);
    bool yellowState = digitalRead(yellowPin);
    bool greenState = digitalRead(greenPin);
    bool blueState = digitalRead(bluePin);

    // Red button
    if (redState == LOW && lastRedState == HIGH) {
        Serial.println("Red button pressed");
    }

    // Yellow button
    if (yellowState == LOW && lastYellowState == HIGH) {
        Serial.println("Yellow button pressed");
    }

    // Green button
    if (greenState == LOW && lastGreenState == HIGH) {
        Serial.println("Green button pressed");
    }

    // Blue button
    if (blueState == LOW && lastBlueState == HIGH) {
        Serial.println("Blue button pressed");
    }

    // Save previous states
    lastRedState = redState;
    lastYellowState = yellowState;
    lastGreenState = greenState;
    lastBlueState = blueState;
}