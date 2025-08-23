import { IOrderService } from '../interfaces/IOrderService';
import { IOrderRepository } from '../interfaces/IOrderRepository';
import { v4 as uuidv4 } from 'uuid';
import { publishToQueue } from '../config/rabbitmq';

export class OrderService implements IOrderService {

  constructor(private orderRepository: IOrderRepository) {}

  async createOrder(data: { name: string; quantity: number; unitPrice: number }) {
    const { name, quantity, unitPrice } = data;
    const totalValue = quantity * unitPrice;
    const order = await this.orderRepository.create({
      id: uuidv4(),
      originalRequest: {
        name,
        quantity,
        unitPrice,
        totalValue,
      },
      statusHistory: [{
        status: 'in_queue',
        updatedAt: Date.now()
      }]
    });

    publishToQueue('order_queue', {
      orderId: order.id,
      ...order.originalRequest,
    });
    
    return order;
  }

  async getOrders() {
    return this.orderRepository.findAll();
  }

  async getOrderById(id: string) {
    return this.orderRepository.findById(id);
  }
}
