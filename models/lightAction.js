const mongoose = require('mongoose');

const lightActionSchema = new mongoose.Schema({
    lightAction: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
   
});

module.exports = mongoose.model('LightAction', lightActionSchema);

