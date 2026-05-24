#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

// WiFi credentials
const char* WIFI_SSID = "Wifi name";
const char* WIFI_PASSWORD = "kode";

// Flespi MQTT broker settings
const char* MQTT_BROKER = "mqtt.flespi.io";
const int MQTT_PORT = 1883;

const char* MQTT_TOKEN = "gtoken";

// Device
const char* DEVICE_ID = "my_device_id"; // TODO: Create a unique device ID

// Publish data
String MQTT_TOPIC = String("controller/" + String(DEVICE_ID) + "/buttonpress"); // TODO: Define the topic for button press data
String MQTT_CONNECT_TOPIC = String("controller/" + String(DEVICE_ID) + "/connectcode");
String MQTT_REQUEST_NAME_TOPIC = String("controller/" + String(DEVICE_ID) + "/getname");

// receive commands
String MQTT_COMMAND_ANIMATION = String("command/" + String(DEVICE_ID) + "/light/animation");
String MQTT_COMMAND_SET_NAME = String("command/" + String(DEVICE_ID) + "/setname");


#endif