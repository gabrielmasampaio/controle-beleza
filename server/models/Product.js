const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
        name: { type: String, required: true },
        description: String,
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        images: [String], // array of base64 strings
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
        brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
        disponibilidade: {
            type: String,
            enum: ['Pronta entrega', 'Sob encomenda', 'Disponível em breve'],
            default: 'Pronta entrega'
        },
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('Product', productSchema);
