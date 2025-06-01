import express from 'express';
import { createOrder, getOrders, getOrderById } from '../controllers/orderController';
import { validateOrder } from '../middleware/validation';

const router = express.Router();

router.post('/', validateOrder, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

export default router; 