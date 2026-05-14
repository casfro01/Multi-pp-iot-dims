#ifndef MQTTCONTROLLER_H
#define MQTTCONTROLLER_H
#include <WiFi.h>
#include <PubSubClient.h>

class MqttController {
    private:
        WiFiClient espClient;
        PubSubClient client;
        void connectToWiFi();
        void connectToMQTT();
        void subscribeToCommands();
        void onCommandReceived(char* topic, uint8_t* payload, unsigned int length);
    
    public:
        MqttController(); // connects to WiFi, MQTT, and subscribes to commands in the constructor
        void publishData(const char* topic, const char* payload);
        void loop();
};

#endif