#ifndef LED_CONTROLLER_H
#define LED_CONTROLLER_H
#include "../Models/ColorModel/Color.h"
#include "../Models/LedModel/Led.h"
class LedController {
    private:
        Led* leds;
        int count = 0;

        enum AnimationType {
            NONE,
            BLINK,
            TRAIN,
            FILL,
            PULSE,
            RAINBOW,
            WAVE,
            BREATHING,
            RAINBOW_BLINK
        };
        AnimationType currentAnimation = NONE;
        Color animationColor = Color(0, 0, 0);
        unsigned long animationStart = 0;
        unsigned long lastStep = 0;
        int animationDuration = 0;

        // blink
        int blinkCount = 0;
        int currentBlink = 0;
        bool blinkState = false;

        // train
        int trainIndex = 0;

        // fill
        int fillIndex = 0;

        // pulse
        int pulseBrightness = 0;
        bool pulseIncreasing = true;

        // rainbow
        int rainbowOffset = 0;

        // wave
        float waveOffset = 0.0f;

        // breathing
        float breathingPhase = 0.0f;

        void clearAll();
    
    public:
        LedController(); // default -> should not use!
        LedController(Led* leds, int count);
        //void addLed(Led led);
        void setColor(int index, Color color);
        
        // animations
        void startBlink(Color color, int times, int speedMs);
        void startTrain(Color color, int speedMs);
        void startFill(Color color, int speedMs);
        void startPulse(Color color, int speedMs);
        void startRainbow(int speedMs);
        void startWave(Color color, int speedMs);
        void startBreathing(Color color, int speedMs);
        void startRainbowBlink(int speedMs);

        void stopAnimation();

        Color randomColor();

        void loop();
};

#endif