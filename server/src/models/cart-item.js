const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
})

exports.CartItem = mongoose.model('CartItem', cartItemSchema);