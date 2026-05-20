#ifndef BUTTONCONTROLLER_H
#define BUTTONCONTROLLER_H

#include <functional>

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
        bool typeCode = false;
        unsigned long lastTimeTaken = 0;
        int codeIndex = 0;
        // 1 = red, 2 = blue, 3 = yellow, 4 = green
        int codeSequence[12] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}; // 12 button presses for the code

        // when pressed, these callbacks will be called if they are set
        std::function<void()> callbackGreen = nullptr;
        std::function<void()> callbackRed = nullptr;
        std::function<void()> callbackYellow = nullptr;
        std::function<void()> callbackBlue = nullptr;
        std::function<void(int*, int)> callbackConnect = nullptr;
        std::function<void()> whileTypingCode = nullptr;
    
    public:
        ButtonController(); // default -> should not use!
        ButtonController(int redPin, int yellowPin, int greenPin, int bluePin);
        void setCallbackGreen(std::function<void()> callback);
        void setCallbackRed(std::function<void()> callback);
        void setCallbackYellow(std::function<void()> callback);
        void setCallbackBlue(std::function<void()> callback);
        void setCallbackConnect(std::function<void(int*, int)> callback);
        void setWhileTypingCode(std::function<void()> callback);
        void loop();
};

#endif