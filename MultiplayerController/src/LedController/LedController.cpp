#include <Arduino.h>
#include <math.h>
#include "LedController.h"
#include "../Models/ColorModel/Color.h"
#include "../Models/LedModel/Led.h"


// helper
Color wheel(int position) {
    position = 255 - position;

    if (position < 85) {
        return Color(
            255 - position * 3,
            0,
            position * 3
        );
    }

    if (position < 170) {
        position -= 85;

        return Color(
            0,
            position * 3,
            255 - position * 3
        );
    }

    position -= 170;

    return Color(
        position * 3,
        255 - position * 3,
        0
    );
}


LedController::LedController(Led* leds, int count) {
    this->leds = leds;
    this->count = count;
}

//void addLed(Led led);

void LedController::setColor(int index, Color color) {
    if (index < 0 || index >= count) {
        return;
    }
    leds[index].setColor(color);
}

void LedController::clearAll() {
    for (int i = 0; i < count; i++) {
        leds[i].setColor(Color(0, 0, 0));
    }
}

void LedController::stopAnimation() {
    currentAnimation = NONE;
    clearAll();
}

void LedController::startBlink(Color color, int times, int speedMs) {
    // override previous animation
    stopAnimation();

    currentAnimation = BLINK;

    animationColor = color;
    blinkCount = times * 2;
    currentBlink = 0;
    blinkState = false;

    animationDuration = speedMs;
    lastStep = millis();
}

void LedController::startTrain(Color color, int speedMs) {
    stopAnimation();

    currentAnimation = TRAIN;

    animationColor = color;
    animationDuration = speedMs;

    trainIndex = 0;
    lastStep = millis();
}

void LedController::startFill(Color color, int speedMs) {
    stopAnimation();

    currentAnimation = FILL;

    animationColor = color;
    animationDuration = speedMs;

    fillIndex = 0;
    lastStep = millis();
}

void LedController::startPulse(Color color, int speedMs) {
    stopAnimation();

    currentAnimation = PULSE;

    animationColor = color;
    animationDuration = speedMs;

    pulseBrightness = 0;
    pulseIncreasing = true;

    lastStep = millis();
}

void LedController::startRainbow(int speedMs) {
    stopAnimation();

    currentAnimation = RAINBOW;

    animationDuration = speedMs;

    rainbowOffset = 0;

    lastStep = millis();
}

void LedController::startWave(Color color, int speedMs) {
    stopAnimation();

    currentAnimation = WAVE;

    animationColor = color;
    animationDuration = speedMs;

    waveOffset = 0.0f;

    lastStep = millis();
}

void LedController::startBreathing(Color color, int speedMs) {
    stopAnimation();

    currentAnimation = BREATHING;

    animationColor = color;
    animationDuration = speedMs;

    breathingPhase = 0.0f;

    lastStep = millis();
}
    //Animation	Good Speed
    //Pulse	15-30ms
    //Rainbow	20-40ms
    //Wave	20-35ms
    //Breathing	15-25ms
void LedController::loop() {
    unsigned long now = millis();

    switch (currentAnimation) {

        case BLINK: {
            if (now - lastStep >= animationDuration) {
                lastStep = now;

                blinkState = !blinkState;

                for (int i = 0; i < count; i++) {
                    leds[i].setColor(
                        blinkState
                            ? animationColor
                            : Color(0, 0, 0)
                    );
                }

                currentBlink++;

                if (currentBlink >= blinkCount) {
                    stopAnimation();
                }
            }
            break;
        }

        case TRAIN: {
            if (now - lastStep >= animationDuration) {
                lastStep = now;

                clearAll();

                leds[trainIndex].setColor(animationColor);

                trainIndex++;

                if (trainIndex >= count) {
                    stopAnimation();
                }
            }
            break;
        }

        case FILL: {

            if (now - lastStep >= animationDuration) {
                lastStep = now;

                leds[fillIndex].setColor(animationColor);

                fillIndex++;

                if (fillIndex >= count) {
                    stopAnimation();
                }
            }
            break;
        }

        case PULSE: {
        if (now - lastStep >= animationDuration) {
            lastStep = now;

            if (pulseIncreasing) {
                pulseBrightness += 5;

                if (pulseBrightness >= 255) {
                    pulseBrightness = 255;
                    pulseIncreasing = false;
                }
            } else {
                pulseBrightness -= 5;

                if (pulseBrightness <= 0) {
                    pulseBrightness = 0;
                    pulseIncreasing = true;
                }
            }

            Color scaled(
                (animationColor.getRedValue() * pulseBrightness) / 255,
                (animationColor.getGreenValue() * pulseBrightness) / 255,
                (animationColor.getBlueValue() * pulseBrightness) / 255
            );

            for (int i = 0; i < count; i++) {
                leds[i].setColor(scaled);
            }
        }

    break;
    }

        case RAINBOW: {
            if (now - lastStep >= animationDuration) {
                lastStep = now;

                for (int i = 0; i < count; i++) {

                    int colorIndex =
                        (i * 256 / count + rainbowOffset) & 255;

                    leds[i].setColor(
                        wheel(colorIndex)
                    );
                }

                rainbowOffset += 5;

                if (rainbowOffset >= 256) {
                    rainbowOffset = 0;
                }
            }

            break;
        }

        case WAVE: {
            if (now - lastStep >= animationDuration) {
                lastStep = now;

                for (int i = 0; i < count; i++) {

                    float wave =
                        (sin((i * 0.5f) + waveOffset) + 1.0f) / 2.0f;

                    int brightness = wave * 255;

                    Color scaled(
                        (animationColor.getRedValue() * brightness) / 255,
                        (animationColor.getGreenValue() * brightness) / 255,
                        (animationColor.getBlueValue() * brightness) / 255
                    );

                    leds[i].setColor(scaled);
                }

                waveOffset += 0.3f;
            }
            break;
        }

        case BREATHING: {
            if (now - lastStep >= animationDuration) {
                lastStep = now;

                float breath =
                    (exp(sin(breathingPhase)) - 0.36787944f) * 108.0f;

                int brightness = constrain((int)breath, 0, 255);

                Color scaled(
                    (animationColor.getRedValue() * brightness) / 255,
                    (animationColor.getGreenValue() * brightness) / 255,
                    (animationColor.getBlueValue() * brightness) / 255
                );

                for (int i = 0; i < count; i++) {
                    leds[i].setColor(scaled);
                }

                breathingPhase += 0.15f;
            }

            break;
        }

        case NONE:
        default:
            break;
    }

    // always update leds
    for (int i = 0; i < count; i++) {
        leds[i].loop();
    }
}