const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
    image: String, // pode ser URL da imagem ou base64
});

module.exports = mongoose.model('Product', productSchema);
