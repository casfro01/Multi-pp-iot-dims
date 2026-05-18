#ifndef BUTTONCONTROLLER_H
#define BUTTONCONTROLLER_H

class ButtonController {
    private:
        int redPin;
        int yellowPin;
        int greenPin;
        int bluePin;
        bool lastRedState = true;
        bool lastYellowState = true;
        bool lastGreenState = true;
        bool lastBlueState = true;
    
    public:
        ButtonController(); // default -> should not use!
        ButtonController(int redPin, int yellowPin, int greenPin, int bluePin);
        void loop();
};

#endif