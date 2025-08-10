export interface IOrderService {
  createOrder(data: { name: string; quantity: number; unitPrice: number }): Promise<any>;
  getOrders(): Promise<any[]>;
  getOrderById(id: string): Promise<any | null>;
}
