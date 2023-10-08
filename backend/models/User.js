const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    password: String,
    role: String,
    software: {
        type: Schema.Types.ObjectId,
        ref: 'Software'
    },
    licenses: [{
        type: Schema.Types.ObjectId,
        ref: 'License'
    }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
