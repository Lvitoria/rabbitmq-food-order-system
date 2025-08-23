
import { IOrderService } from '../interfaces/IOrderService';
import { IOrderRepository } from '../interfaces/IOrderRepository';

export class OrderService implements IOrderService {

  constructor(private orderRepository: IOrderRepository) {}

  processOrder = async (message: any): Promise<void> => {
    const { orderId } = message;

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 5000));

    await this.orderRepository.update(orderId, { status: 'in_preparation' });

    // Simulate more processing time
    await new Promise(resolve => setTimeout(resolve, 5000));

    await this.orderRepository.update(orderId, { status: 'ready_for_delivery' });
  }
}
