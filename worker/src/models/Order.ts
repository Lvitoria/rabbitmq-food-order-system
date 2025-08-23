
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const orderSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4
    },
    originalRequest: {
        name: {
            type: String,
            required: [true, 'O nome é obrigatório'],
            minlength: [3, 'O nome deve ter pelo menos 3 caracteres'],
            maxlength: [100, 'O nome não pode ter mais de 100 caracteres']
        },
        quantity: {
            type: Number,
            required: [true, 'A quantidade é obrigatória'],
            min: [1, 'A quantidade deve ser maior que zero']
        },
        unitPrice: {
            type: Number,
            required: [true, 'O preço unitário é obrigatório'],
            min: [0.01, 'O preço unitário deve ser maior que zero']
        },
        totalValue: {
            type: Number,
            required: true
        },
    },
    status: {
        type: String,
        enum: ['in_queue', 'in_preparation', 'ready_for_delivery', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'in_queue'
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ['in_queue', 'in_preparation', 'ready_for_delivery', 'out_for_delivery', 'delivered', 'cancelled'],
            required: true
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);
