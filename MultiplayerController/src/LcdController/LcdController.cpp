#include "LcdController.h"
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LcdController::LcdController(int sdaPin, int sclPin) : lcd(LCD_ADDRESS, LCD_COLUMNS, LCD_ROWS) {
    this->sdaPin = sdaPin;
    this->sclPin = sclPin;
}

void LcdController::lcdInit() {
    Wire.begin(sdaPin, sclPin);
    lcd.init();
    lcd.backlight();

    lcdPrint("None");
}

void LcdController::lcdPrint(const char* str) {
    this->lcdClear();
    lcd.setCursor(0,0);
    lcd.print("Name: ");
    lcd.setCursor(0,1);
    lcd.print(str);
}

void LcdController::lcdClear() {
    lcd.clear();
}