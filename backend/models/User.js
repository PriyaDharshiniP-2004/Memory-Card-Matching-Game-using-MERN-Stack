
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    theme : {type: String, required: true},
    level: { type: String, required: true},
    time: { type: Number, required: true },
    attempts: { type: Number, required: true },
});
const User = mongoose.model('User', userSchema);

module.exports = User;