#ifndef MQTTCONTROLLER_H
#define MQTTCONTROLLER_H
#include <WiFi.h>
#include <PubSubClient.h>
#include "../LedController/LedController.h"
#include "../ButtonController/ButtonController.h"

class MqttController {
    private:
        char* display_name;

        WiFiClient espClient;
        PubSubClient client;
        LedController* ledController;
        ButtonController* buttonController;
        void connectToWiFi();
        void connectToMQTT();
        void subscribeToCommands();
        void onCommandReceived(char* topic, uint8_t* payload, unsigned int length);
        void lightAnimationCommandHandler(const char* message);
    
    public:
        MqttController();
        void init(); // connects to WiFi, MQTT, and subscribes to commands in the constructor
        void publishData(const char* path, const char* payload);
        void loop();

        void setLedController(LedController& controller);
        void setButtonController(ButtonController& controller);
};

#endif