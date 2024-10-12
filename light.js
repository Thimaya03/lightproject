const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
const topic = 'smartHome/room/allSensors';

client.on('connect', () => {
    client.subscribe(topic);
    console.log('mqtt connected');
});

client.on('message', (topic, message) => {
    try {
        // Parse the incoming message as an array of sensor data objects
        const sensorDataArray = JSON.parse(message.toString());

        // Check each sensor's data
        sensorDataArray.forEach(sensorData => {
            const room = sensorData.room; // Get the room name directly
            const lightAction = sensorData.lightAction; // Get the light action
            const timestamp = sensorData.timestamp; // Get the timestamp

            if (room && lightAction) {
                // Log the action taken for the specified room
                console.log(`${lightAction} in ${room} at ${timestamp}`);
            } else {
                console.log(`No action specified for ${room} light at ${timestamp}`);
            }
        });
    } catch (error) {
        console.error('Failed to parse message:', error);
    }
});
