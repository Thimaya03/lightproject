const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mqttClient = require('./client');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://thimayadassanayake:VJvEjuEXnIr1jSq3@sit314.2yuqenw.mongodb.net', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the log schema and model
const LogSchema = new mongoose.Schema({
    eventType: String,
    room: String,
    eventData: Object,
    timestamp: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', LogSchema);

// Listen for MQTT messages and log them to MongoDB
mqttClient.onMessage((topic, message) => {
    const [event, room] = topic.split('/').slice(1, 3);  // Extract event type and room from the topic
    const log = new Log({
        eventType: event,
        room: room,
        eventData: JSON.parse(message)  // Parse message as event data
    });
    log.save().then(() => console.log(`Logged ${event} event for ${room} to MongoDB`));
});

// API endpoint to retrieve logs
app.get('/logs', (req, res) => {
    Log.find().then((logs) => res.json(logs));
});

// Start the API server
app.listen(3000, () => console.log('API service running on port 3000'));
