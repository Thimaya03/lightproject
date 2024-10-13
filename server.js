const express = require('express');
const mongoose = require('mongoose');
const SensorData = require('./models/SensorData'); 
const LightAction = require('./models/lightAction'); 

const app = express();
app.use(express.json());

// Connect to MongoDB Atlas
const dbURI = 'mongodb+srv://thimayadassanayake:VJvEjuEXnIr1jSq3@sit314.2yuqenw.mongodb.net';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Endpoint to accept sensor data
app.post('/api/sensor', async (req, res) => {
    const { room, motionDetected, temperature, brightness, timestamp } = req.body;

    // Validate the incoming sensor data format
    if (!room || typeof room !== 'string' || 
        typeof motionDetected !== 'boolean' || 
        typeof temperature !== 'number' || 
        typeof brightness !== 'number' || 
        !timestamp || typeof timestamp !== 'string') {
        return res.status(400).json({ 
            message: 'Invalid sensor data format',
            details: {
                room: typeof room === 'string' ? room : 'Invalid room',
                motionDetected: typeof motionDetected === 'boolean' ? motionDetected : 'Invalid motionDetected',
                temperature: typeof temperature === 'number' ? temperature : 'Invalid temperature',
                brightness: typeof brightness === 'number' ? brightness : 'Invalid brightness',
                timestamp: typeof timestamp === 'string' ? timestamp : 'Invalid timestamp',
            }
        });
    }

   // Determine light action based on sensor data
   const lightActionSetting = determineLightAction(temperature, brightness, motionDetected, room);
  

   // Create and save sensor data along with light action
   const sensorData = new SensorData({ 
       room, 
       motionDetected, 
       temperature, 
       brightness, 
       timestamp,
       lightAction: lightActionSetting // Include light action in sensor data
   });

   try {
       await sensorData.save();
       console.log('Sensor data saved:', sensorData);
        
        res.status(201).json({ sensorData, lightAction: lightActionSetting }); // Respond with the saved sensor data and light action
    } catch (error) {
        console.error('Error saving sensor data:', error.message);
        res.status(500).json({ message: 'Error saving sensor data' });
    }
});

// Function to determine the light action based on sensor data
const determineLightAction = (temperature, brightness, motionDetected, room) => {
    let lightAction;

    if (brightness > 90) {
        lightAction = `turnOff lights in ${room}`; // Turn off lights if brightness is above 90%
    } else {
        if (motionDetected) {
            if (temperature > 25) {
                lightAction = `turnOn and dim lights in ${room}`; // Turn on and dim lights if temperature is above 25
            } else {
                lightAction = `turnOn and brighten lights in ${room}`; // Turn on and brighten lights if temperature is 25 or below
            }
        } else {
            lightAction = `keep lights off in ${room}`; // Keep lights off if no motion detected
        }
    }

    return lightAction; // Return the determined light action
};

// Function to call and save the light action (simulated)
const callLightAction = async (setting) => {
    const lightActionData = new LightAction({ setting });
    await lightActionData.save();
    
};

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
