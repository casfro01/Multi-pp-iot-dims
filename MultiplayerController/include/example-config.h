#ifndef CONFIG_H
#define CONFIG_H

// WiFi credentials
const char* WIFI_SSID = "";
const char* WIFI_PASSWORD = "";

// Flespi MQTT broker settings
const char* MQTT_BROKER = "mqtt.flespi.io";
const int MQTT_PORT = 1883;
const char* MQTT_TOKEN = "";

// Device
const char* DEVICE_ID = "my_device_id"; // TODO: Create a unique device ID

const char* MQTT_TOPIC = "my/jens/lol";

const char* MQTT_COMMAND = "my/Jens/lol/command";

#endif