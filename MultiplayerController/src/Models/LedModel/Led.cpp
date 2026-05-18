#include <iostream>
#include <Arduino.h>
#include "Led.h"
#include "../ColorModel/Color.h"

Led::Led() {
    // Default constructor, should not be used
}

Led::Led(int redPin, int greenPin, int bluePin, int redChannel, int greenChannel, int blueChannel) {
    this->redPin = redPin;
    this->greenPin = greenPin;
    this->bluePin = bluePin;
    this->redChannel = redChannel;
    this->greenChannel = greenChannel;
    this->blueChannel = blueChannel;

    // TODO: Configure and attach PWM for each color pin
    // PWM Configuration
    int PWM_FREQ = 5000;
    int PWM_RESOLUTION = 8;  // 0-255
    ledcSetup(redChannel, PWM_FREQ, PWM_RESOLUTION);
    ledcSetup(greenChannel, PWM_FREQ, PWM_RESOLUTION);
    ledcSetup(blueChannel, PWM_FREQ, PWM_RESOLUTION);

    ledcAttachPin(redPin, this->redChannel);
    ledcAttachPin(greenPin, this->greenChannel);
    ledcAttachPin(bluePin, this->blueChannel);
}

void Led::setColor(Color color){
    // TODO: Set PWM duty cycle for each color pin
    // Use ledcWrite(pin, value) for each pin
    // Values: 0 (off) to 255 (full brightness)
    ledcWrite(this->redChannel, color.getRedValue());
    ledcWrite(this->greenChannel, color.getGreenValue());
    ledcWrite(this->blueChannel, color.getBlueValue());
}

// TODO : idk om disse skal være her... måske det skal være i led controlleren.
void Led::blinkAnimation(int seconds){

}

void Led::loop(){
}