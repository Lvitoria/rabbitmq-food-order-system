
import { Order } from '../models/Order';
import { IOrderRepository } from '../interfaces/IOrderRepository';

export class OrderRepository implements IOrderRepository {
  async update(id: string, data: any): Promise<any> {
    console.log(`Updating order ${id} with data:`, data);
    return Order.findOneAndUpdate({ id }, data, { new: true });
  }
}
