const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

const topic = 'smartHome/room/motion';

client.on('connect', () => 
    {
        client.subscribe(topic);
        console.log('mqtt connected');
    });
    
client.on('message', (topic, message) => {
        const rawMessage = message.toString();
        console.log(`Received message: ${rawMessage}`); // Log the raw message
    
        // Parse the incoming message as an array of strings
        let sensorDataArray;
        try {
            sensorDataArray = JSON.parse(rawMessage);
        } catch (error) {
            console.error('Failed to parse message as JSON:', error);
            return; // Exit if parsing fails
        }
    
        // Check each sensor's data
        sensorDataArray.forEach(sensorData => {
            // Check if motion is detected by analyzing the string
            const isMotionDetected = sensorData.includes("Motion detected");
            const room = sensorData.match(/in (\w+)/); // Extract the room name from the string
            const timestamp = new Date().toISOString(); // Generate the current timestamp
    
            if (room) {
                const roomName = room[1]; // Get the room name from the regex match
    
                if (isMotionDetected) {
                    console.log(`Motion detected in ${roomName} at ${timestamp}`);
                } else {
                    console.log(`No motion detected in ${roomName} at ${timestamp}`);
                }
            } else {
                console.log(`Room not identified in message: ${sensorData}`);
            }
        });
    });