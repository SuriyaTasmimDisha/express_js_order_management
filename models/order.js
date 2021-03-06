const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true    
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
     },
    date: {
        type: Date,
        default: Date.now
    },
    order_status: {
        type: String,
        default: 'pending'
    },
    price:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema)