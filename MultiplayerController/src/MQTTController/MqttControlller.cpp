#include "MqttController.h"
#include <WiFi.h>
#include "config.h"
MqttController::MqttController() {
    connectToWiFi();
    client = PubSubClient(espClient);
    connectToMQTT();
    subscribeToCommands();
}

void MqttController::connectToWiFi() {
    Serial.println("Connecting to WiFi...");
    Serial.println("============================");
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    int i = 0;
    while (WiFi.status() != WL_CONNECTED){
        i++;
        Serial.println("Count: " + String(i));
        delay(500);
    }
    Serial.println("Contacted Jesus, from the heavens, and he said:");
    Serial.println("We're in!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
}

void MqttController::onCommandReceived(char* topic, uint8_t* payload, unsigned int length) {
    Serial.print("Received command on topic: ");
    Serial.println(topic);
    Serial.print("Payload: ");
    for (unsigned int i = 0; i < length; ++i) {
        Serial.write(payload[i]);
    }
    Serial.println();
}

void MqttController::connectToMQTT() {
    client.setServer(MQTT_BROKER, MQTT_PORT);
    client.setCallback([this](char* topic, uint8_t* payload, unsigned int length) {
        this->onCommandReceived(topic, payload, length);
    });
    Serial.println("Connecting to MQTT...");
    Serial.println("============================");
    if (client.connect(DEVICE_ID, MQTT_TOKEN, "")) {
        Serial.println("Connected to MQTT broker!");
    } else {
        Serial.print("Failed to connect to MQTT broker, state: ");
        Serial.println(client.state());
    }
}

void MqttController::subscribeToCommands() {
    client.subscribe(MQTT_COMMAND);
}

void MqttController::publishData(const char* topic, const char* payload) {
    if (client.publish(topic, payload)) {
        Serial.println("Data published successfully!");
    } else {
        Serial.println("Failed to publish data.");
    }
}

void MqttController::loop() {
    client.loop();
}