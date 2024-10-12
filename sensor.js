const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
const axios = require('axios');

// Define a single topic for all rooms
const topic = 'smartHome/room/allSensors';

// Generate random sensor data for each room
function generateRoomData() {
    const rooms = ['livingRoom', 'kitchen', 'bedRoom'];
    return rooms.map(room => ({
        room: room,
        motionDetected: Math.random() < 0.5, // 50% chance of detecting motion
        temperature: Math.floor(Math.random() * 15) + 20, // Simulated temperature between 20°C and 35°C
        brightness: Math.floor(Math.random() * 101), // Simulated brightness between 0% and 100%
        timestamp: new Date().toISOString() // Current timestamp
    }));
}

async function simulateRoomSensors() {
    const sensorDataArray = generateRoomData();

    console.log('Generated Sensor Data:', JSON.stringify(sensorDataArray));

    // Send each sensor data one at a time
    for (const sensorData of sensorDataArray) {
        try {
            const response = await axios.post('http://localhost:5000/api/sensor', sensorData);
            console.log('Publishing data:', JSON.stringify(sensorData));
            console.log('Data saved:', response.data);
        } catch (error) {
            console.error('Error saving sensor data:', error.response ? error.response.data : error.message);
            console.error('Full Error Object:', error);
        }
    }

    // Publish sensor data via MQTT
    client.publish(topic, JSON.stringify(sensorDataArray));
}

// Publish sensor data every 5 seconds
setInterval(simulateRoomSensors, 5000);

client.on('connect', () => {
    console.log('Connected to MQTT broker for room sensors');
});

client.on('error', (error) => {
    console.error('MQTT Connection Error:', error);
});
