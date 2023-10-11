const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const licenseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    softwareId: {
        type: Schema.Types.ObjectId,
        ref: 'Software'
    },
    key: String,
    expirationDate: Date,
    createdAt: Date
});

const License = mongoose.model('License', licenseSchema);
module.exports = License;
