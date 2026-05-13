#ifndef COLOR_H
#define COLOR_H
class Color {
    private:
        int redValue;
        int greenValue;
        int blueValue;
    
    public:
        Color(int redValue, int greenValue, int blueValue);
        int getRedValue();
        int getGreenValue();
        int getBlueValue();
};

#endif