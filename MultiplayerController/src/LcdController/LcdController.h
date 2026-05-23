#ifndef LCD_CONTROLLER_H
#define LCD_CONTROLLER_H

#include <Arduino.h>

class LcdController {
    public:
        LcdController();
        void lcdInit();
        void lcdPrint(const char* str);
        void lcdClear();

};
#endif 