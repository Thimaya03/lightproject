const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    room: { type: String, required: true },
    motionDetected: { type: Boolean, required: true },
    brightness: { type: Number, required: true},
    temperature: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    lightAction: { type: String, required: true },
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
