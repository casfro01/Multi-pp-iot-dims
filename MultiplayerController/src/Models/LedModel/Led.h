#ifndef LED_H
#define LED_H
#include "../ColorModel/Color.h"

class Led {
    private:
        int redPin;
        int greenPin;
        int bluePin;

        int redChannel;
        int greenChannel;
        int blueChannel;

        int redValue = 0;
        int greenValue = 0;
        int blueValue = 0;

        bool blinking = false;
        int blinkDelay = 500;
        unsigned long lastBlink = 0;
        bool ledOn = true;
    
    public:
        Led(int redPin, int greenPin, int bluePin, int redChannel, int greenChannel, int blueChannel);
        void setColor(Color color);
        void blinkAnimation(int seconds);
        void loop();
};

#endif