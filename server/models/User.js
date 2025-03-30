const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // pode ser e-mail
    password: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
