#include "MqttController.h"
#include <WiFi.h>
#include "config.h"

MqttController::MqttController() : client(espClient) {
}

void MqttController::init() {
    connectToWiFi();
    
    client.setServer(MQTT_BROKER, MQTT_PORT);

    client.setCallback([this](char* topic, uint8_t* payload, unsigned int length) {
        this->onCommandReceived(topic, payload, length);
    });

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
    if (strcmp(topic, MQTT_COMMAND_ANIMATION) == 0) {
        String message;
        for (unsigned int i = 0; i < length; i++) {
            message += (char)payload[i];
        }
        Serial.println(message);
        lightAnimationCommandHandler(message.c_str());
    } 
    else if (strcmp(topic, MQTT_COMMAND_SET_NAME) == 0) {
        String message;
        for (unsigned int i = 0; i < length; i++) {
            message += (char)payload[i];
        }
        this->display_name = strdup(message.c_str()); // Store the new display name (ensure to free old name if necessary)
        // indsæt opdatering at LCD
        Serial.println(message);
    }
    else {
        Serial.println("Unknown command topic");
    }
}

void MqttController::lightAnimationCommandHandler(const char* message) {
    if (strcmp(message, "Blink") == 0) {
        ledController->startBlink(Color(140, 245, 12), 12, 250);
    }
    else if (strcmp(message, "Train") == 0) {
        ledController->startTrain(Color(0,255,0), 250);
    }
    else if (strcmp(message, "Pulse") == 0) {
        ledController->startPulse(Color(255,0,0), 20);
    }
    else {
        Serial.println("Unknown animation: " + String(message));
    }
}

void MqttController::setLedController(LedController& controller) {
    ledController = &controller;
}
void MqttController::setButtonController(ButtonController& controller) {
    buttonController = &controller;
    // ButtonController expects plain function pointers. Use static wrappers.
    buttonController->setCallbackGreen([this]() {
        Serial.println("Green button callback triggered");
        this->publishData(MQTT_TOPIC, "{\"Button\":\"Green\"}");
    });
    buttonController->setCallbackRed([this]() {
        Serial.println("Red button callback triggered");
        this->publishData(MQTT_TOPIC, "{\"Button\":\"Red\"}");
    });
    buttonController->setCallbackYellow([this]() {
        Serial.println("Yellow button callback triggered");
        this->publishData(MQTT_TOPIC, "{\"Button\":\"Yellow\"}");
    });
    buttonController->setCallbackBlue([this]() {
        Serial.println("Blue button callback triggered");
        this->publishData(MQTT_TOPIC, "{\"Button\":\"Blue\"}");
    });
    buttonController->setCallbackConnect([this](int* codeSequence, int length) {
        String message = "{\"ConnectCode\":\"";
        Serial.println("Connect callback triggered with code sequence:");
        for (int i = 0; i < length; i++) {
            message += String(codeSequence[i]) + " ";
        }
        message += "\"}";
        Serial.println(message);
        publishData(MQTT_CONNECT_TOPIC, message.c_str());
        ledController->startBlink(Color(0, 255, 255), 1, 150); // Blink cyan on successful code entry
    });
    buttonController->setWhileTypingCode([this]() {
        ledController->startBlink(Color(255, 255, 0), 1200, 100); // Blink yellow while typing code
    });
}

void MqttController::connectToMQTT() {
    Serial.println("Connecting to MQTT...");
    Serial.println("============================");
    while (!client.connected()) {
        if (client.connect(DEVICE_ID, MQTT_TOKEN, "")) {
            Serial.println("MQTT connected");
        } else {
            Serial.print("failed state=");
            Serial.println(client.state());
            delay(2000);
        }
    }
}

void MqttController::subscribeToCommands() {
    client.subscribe(MQTT_COMMAND_ANIMATION);
    client.subscribe(MQTT_COMMAND_SET_NAME);
}

void MqttController::publishData(const char* path, const char* payload) {
    if (client.publish(path, payload)) {
        Serial.println("Data published successfully!");
    } else {
        Serial.println("Failed to publish data.");
    }
}

void MqttController::loop() {
    client.loop();
}