const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const softwareSchema = new Schema({
    name: String,
    version: String,
    description: String,
    price: Number,
    createdAt: Date,
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Software = mongoose.model('Software', softwareSchema);
module.exports = Software;
