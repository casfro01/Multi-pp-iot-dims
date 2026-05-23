#include "Manager.h"

Manager::Manager() :
            led1(
                // pins
                26, 14, 25,
                // channels 
                0, 1, 2),
            led2(
                // pins
                21, 13, 2, 
                // channels
                3, 4, 5),
            led3(
                // pins
                16, 17, 22, 
                // channels
                6, 7, 8),
            led4(
                // pins
                19, 23, 18, 
                // channels
                9, 10, 11),
            ledController(nullptr, 4),
            buttonController(39, 34, 36, 35),
            lcdController()
{
    leds[0] = led2;
    leds[1] = led1;
    leds[2] = led3;
    leds[3] = led4;

    ledController = LedController(leds, 4);
}

void Manager::begin() {
    ledController.startTrain(Color(0, 255, 0), 250);
    mqttController.setLedController(ledController);
    mqttController.setButtonController(buttonController);
    mqttController.init();
    ledController.startBlink(Color(255, 255, 0), 10, 100);
    lcdController.lcdInit();
}

void Manager::loop() {
    buttonController.loop();
    ledController.loop();
    mqttController.loop();
}