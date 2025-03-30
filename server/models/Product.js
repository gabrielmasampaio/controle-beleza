const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
        name: String,
        description: String,
        price: Number,
        storage: Number,
        image: String, // base64
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('Product', productSchema);
