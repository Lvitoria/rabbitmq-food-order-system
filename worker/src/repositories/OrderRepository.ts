
import { Order } from '../models/Order';
import { IOrderRepository } from '../interfaces/IOrderRepository';

export class OrderRepository implements IOrderRepository {
  async update(id: string, data: any): Promise<any> {
    return Order.findOneAndUpdate({ id }, data, { new: true });
  }
}
