#include "LedController.h"
#include "../Models/ColorModel/Color.h"
#include "../Models/LedModel/Led.h"


LedController::LedController(Led* leds, int count) {
    this->leds = leds;
    this->count = count;
}

//void addLed(Led led);

void LedController::setColor(int index, Color color) {
    if (index < 0 || index >= count) {
        return;
    }
    leds[index].setColor(color);
}

//void blinkAnimation(int seconds);

void LedController::loop() {
    // Implementation for the loop function
    for (int i = 0; i < count; i++) {
        leds[i].loop();
    }
}