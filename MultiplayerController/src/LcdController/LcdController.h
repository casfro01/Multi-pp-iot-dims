#ifndef LCD_CONTROLLER_H
#define LCD_CONTROLLER_H

#include <Arduino.h>
#include <LiquidCrystal_I2C.h>

class LcdController {
    private:
        const int LCD_ADDRESS = 0x27; // I2C address of the LCD
        const int LCD_COLUMNS = 16;   // Number of columns in the LCD
        const int LCD_ROWS = 2;       // Number of rows in the LCD    

        int sdaPin;
        int sclPin;

        LiquidCrystal_I2C lcd;

    public:
        LcdController(int sdaPin, int sclPin);
        void lcdInit();
        void lcdPrint(const char* str);
        void lcdClear();

};
#endif 