#ifndef BUTTONCONTROLLER_H
#define BUTTONCONTROLLER_H

class ButtonController {
    private:
        int redPin;
        int yellowPin;
        int greenPin;
        int bluePin;
        bool lastRedState = HIGH;
        bool lastYellowState = HIGH;
        bool lastGreenState = HIGH;
        bool lastBlueState = HIGH;
    
    public:
        ButtonController(int redPin, int yellowPin, int greenPin, int bluePin);
        void loop();
};

#endif