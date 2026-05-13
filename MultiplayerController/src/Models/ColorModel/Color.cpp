#include "Color.h"

Color::Color(int redValue, int greenValue, int blueValue){
    this->redValue = redValue;
    this->greenValue = greenValue;
    this->blueValue = blueValue;
}
int Color::getRedValue() {
    return this->redValue;
}
int Color::getGreenValue() {
    return this->greenValue;
}
int Color::getBlueValue() {
    return this->blueValue;
}