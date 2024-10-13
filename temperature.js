const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
const topic = 'smartHome/room/temperature';


const rooms = ['livingRoom', 'kitchen', 'bedRoom'];

client.on('connect', () => {
    client.subscribe(topic);
    console.log('MQTT connected and subscribed to topic:', topic);
});

client.on('message', (topic, message) => {
    const rawMessage = message.toString();
    console.log(`Received message: ${rawMessage}`); // Log the raw message

    let sensorDataArray;
    try {
        // Attempt to parse the message as a JSON array
        sensorDataArray = JSON.parse(rawMessage);
    } catch (error) {
        console.error('Failed to parse message as JSON:', error);
        return; // Exit if parsing fails
    }

    // Map the sensor data to specific rooms
    sensorDataArray.forEach((sensorData, index) => {
        const room = rooms[index]; // Get the room name from the predefined list
        const timestamp = new Date().toISOString(); // Generate the current timestamp

        if (room) {
            // Log the action and timestamp for the specific room
            console.log(`Action for ${room}: ${sensorData}, Timestamp: ${timestamp}`);
        } else {
            console.log(`No room assigned for action: ${sensorData}`);
        }
    });
});
