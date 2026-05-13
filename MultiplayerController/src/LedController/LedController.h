#ifndef LED_CONTROLLER_H
#define LED_CONTROLLER_H
#include "../Models/ColorModel/Color.h"
#include "../Models/LedModel/Led.h"
class LedController {
    private:
        Led* leds;
        int count = 0;
    
    public:
        LedController(Led* leds, int count);
        //void addLed(Led led);
        void setColor(int index, Color color);
        //void blinkAnimation(int seconds);
        void loop();
};

#endif