const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    role: {
        type: String,
        enum: ['guest', 'member', 'admin'],
        default: 'guest'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { database: process.env.DB_NAME });


module.exports = mongoose.model('User', UserSchema);
