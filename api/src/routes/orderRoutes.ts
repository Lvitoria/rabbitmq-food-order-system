import express from 'express';

import { OrderController } from '../controllers/OrderController';
import { OrderService } from '../services/OrderService';
import { OrderRepository } from '../repositories/OrderRepository';
import { validateOrder } from '../middleware/validation';

const router = express.Router();
const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

router.post('/', validateOrder, orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

export default router;