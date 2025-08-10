import { Order } from '../models/Order';
import { IOrderRepository } from '../interfaces/IOrderRepository';

export class OrderRepository implements IOrderRepository {
  async create(data: any): Promise<any> {
    return Order.create(data);
  }

  async findAll(): Promise<any[]> {
    return Order.find({}, { status: 0 }).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<any | null> {
    return Order.findOne({ id }, { status: 0 });
  }
}
