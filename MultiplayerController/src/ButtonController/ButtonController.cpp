#include <iostream>
#include <Arduino.h>
#include "ButtonController.h"

ButtonController::ButtonController() {
    // default constructor, should not use
}

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
    unsigned long now = millis();
    bool redState = digitalRead(redPin);
    bool yellowState = digitalRead(yellowPin);
    bool greenState = digitalRead(greenPin);
    bool blueState = digitalRead(bluePin);


    // Debounce each pin — only commit a state change after it's been stable for DEBOUNCE_MS
    if (redState != lastRawRedState) lastDebounceRed = now; lastRawRedState = redState;
    if (yellowState != lastRawYellowState) lastDebounceYellow = now; lastRawYellowState = yellowState;
    if (greenState != lastRawGreenState) lastDebounceGreen = now; lastRawGreenState = greenState;
    if (blueState != lastRawBlueState) lastDebounceBlue = now; lastRawBlueState = blueState;

    bool stableRed = (now - lastDebounceRed)    >= DEBOUNCE_MS ? redState : lastRedState;
    bool stableYellow = (now - lastDebounceYellow) >= DEBOUNCE_MS ? yellowState : lastYellowState;
    bool stableGreen = (now - lastDebounceGreen)  >= DEBOUNCE_MS ? greenState : lastGreenState;
    bool stableBlue = (now - lastDebounceBlue)   >= DEBOUNCE_MS ? blueState : lastBlueState;


    // Red button
    if (stableRed == LOW && lastRedState == HIGH) {
        Serial.println("Red button pressed");
        if (typeCode == true){
            codeSequence[codeIndex] = 1;
            codeIndex++;
            if (codeIndex == 12){
                if (callbackConnect) {
                    callbackConnect(codeSequence, 12);
                }
                // todo: remove when done testing
                Serial.println("Code entered: ");
                for (int i = 0; i < 12; i++){
                    Serial.print(codeSequence[i]);
                    Serial.print(" ");
                }
                Serial.println();
                // end remove
                codeIndex = 0;
                typeCode = false;
            }
        }
        else if (callbackRed) {
            callbackRed();
        }
    }

    // Yellow button
    if (stableYellow == LOW && lastYellowState == HIGH) {
        Serial.println("Yellow button pressed");
        if (typeCode == true){
            codeSequence[codeIndex] = 3;
            codeIndex++;
            if (codeIndex == 12){
                if (callbackConnect) {
                    callbackConnect(codeSequence, 12);
                }
                // todo: remove when done testing
                Serial.println("Code entered: ");
                for (int i = 0; i < 12; i++){
                    Serial.print(codeSequence[i]);
                    Serial.print(" ");
                }
                Serial.println();
                // end remove
                codeIndex = 0;
                typeCode = false;
            }
        }
        else if (callbackYellow) {
            callbackYellow();
        }
    }

    // Green button
    if (stableGreen == LOW && lastGreenState == HIGH) {
        Serial.println("Green button pressed");
        if (typeCode == true){
            codeSequence[codeIndex] = 4;
            codeIndex++;
            if (codeIndex == 12){
                if (callbackConnect) {
                    callbackConnect(codeSequence, 12);
                }
                // todo: remove when done testing
                Serial.println("Code entered: ");
                for (int i = 0; i < 12; i++){
                    Serial.print(codeSequence[i]);
                    Serial.print(" ");
                }
                Serial.println();
                // end remove
                codeIndex = 0;
                typeCode = false;
            }
        }
        else if (callbackGreen) {
            callbackGreen();
        }
    }

    // Blue button
    if (stableBlue == LOW && lastBlueState == HIGH) {
        Serial.println("Blue button pressed");
        if (typeCode == true){
            codeSequence[codeIndex] = 2;
            codeIndex++;
            if (codeIndex == 12){
                if (callbackConnect) {
                    callbackConnect(codeSequence, 12);
                }
                // todo: remove when done testing
                Serial.println("Code entered: ");
                for (int i = 0; i < 12; i++){
                    Serial.print(codeSequence[i]);
                    Serial.print(" ");
                }
                Serial.println();
                // end remove
                codeIndex = 0;
                typeCode = false;
            }
        }
        else if (callbackBlue) {
            callbackBlue();
        }
    }

    if (stableGreen == LOW && lastGreenState == LOW && stableRed == LOW && lastRedState == LOW){
        if (typeCode == false && lastTimeTaken == 0){
            Serial.println("Type code button pressed");
            lastTimeTaken = millis();
        }
        else if (typeCode == false && lastTimeTaken + 5000 < millis()){
            Serial.println("Start typeing code");
            typeCode = true;
            if (whileTypingCode) {
                whileTypingCode();
            }
        }

    }
    else if (lastTimeTaken != 0){
        lastTimeTaken = 0;
    }

    // Save previous states
    lastRedState = stableRed;
    lastYellowState = stableYellow;
    lastGreenState = stableGreen;
    lastBlueState = stableBlue;
}

void ButtonController::setCallbackGreen(std::function<void()> callback) {
    callbackGreen = callback;
}

void ButtonController::setCallbackRed(std::function<void()> callback) {
    callbackRed = callback;
}

void ButtonController::setCallbackYellow(std::function<void()> callback) {
    callbackYellow = callback;
}

void ButtonController::setCallbackBlue(std::function<void()> callback) {
    callbackBlue = callback;
}

void ButtonController::setCallbackConnect(std::function<void(int*, int)> callback) {
    callbackConnect = callback;
}

void ButtonController::setWhileTypingCode(std::function<void()> callback) {
    whileTypingCode = callback;
}
