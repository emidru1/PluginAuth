const mongoose = require('mongoose');

const LicenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    softwareId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Software',
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    key: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { database: process.env.DB_NAME });


module.exports = mongoose.model('License', LicenseSchema);
