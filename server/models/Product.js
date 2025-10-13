const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
        name: { type: String, required: true },
        description: String,
        price: { type: Number, required: true },
        storage: { type: Number, required: true },
        images: [String], // array of base64 strings
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
        brands: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }],
        availability: {
            type: String,
            enum: ['A pronta entrega', 'A Caminho', 'Somente Encomenda'],
            default: 'A pronta entrega'
        },
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('Product', productSchema);