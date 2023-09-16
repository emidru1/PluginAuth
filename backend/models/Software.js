const mongoose = require('mongoose');

const SoftwareSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    version: String,
    description: String,
    price: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { database: process.env.DB_NAME });

module.exports = mongoose.model('Software', SoftwareSchema);
