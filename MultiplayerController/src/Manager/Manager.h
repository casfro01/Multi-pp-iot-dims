#ifndef MANAGER_H
#define MANAGER_H

#include "../ButtonController/ButtonController.h"
#include "../LedController/LedController.h"
#include "../Models/LedModel/Led.h"
#include "../MQTTController/MqttController.h"
#include "../LcdController/LcdController.h"

class Manager {
    private:
       // const int redPin = 39;
       // const int yellowPin = 34;
       // const int greenPin = 36;
       // const int bluePin = 35;


       // const int led1PinRed = 26;
       // const int led1PinGreen = 14;
       // const int led1PinBlue = 25;
       // const int led1RedChannel = 0;
       // const int led1GreenChannel = 1;
       // const int led1BlueChannel = 2;

       // const int led2PinRed = 21;
       // const int led2PinGreen = 13;
       // const int led2PinBlue = 2;
       // const int led2RedChannel = 3;
       // const int led2GreenChannel = 4;
       // const int led2BlueChannel = 5;

       // const int led3PinRed = 16;
       // const int led3PinGreen = 17;
       // const int led3PinBlue = 22;
       // const int led3RedChannel = 6;
       // const int led3GreenChannel = 7;
       // const int led3BlueChannel = 8;

       // const int led4PinRed = 19;
       // const int led4PinGreen = 23;
       // const int led4PinBlue = 18;
       // const int led4RedChannel = 9;
       // const int led4GreenChannel = 10;
       // const int led4BlueChannel = 11;

        Led leds[4];

        Led led1;
        Led led2;
        Led led3;
        Led led4;

        //Blink	150-300ms	Lower = faster blinking
        //Train	60-150ms	Feels smooth around 100ms
        //Fill	80-200ms	Slower looks cleaner
        //Pulse	15-30ms	Smooth fade updates
        //Rainbow	20-40ms	30ms is usually perfect
        //Wave	20-35ms	Depends on LED count
        //Breathing	15-25ms	Smooth ambient effect
        LedController ledController;
        MqttController mqttController;
        ButtonController buttonController;
        LcdController lcdController;
    
    public:
        Manager();
        void begin();
        void loop();
};

#endif