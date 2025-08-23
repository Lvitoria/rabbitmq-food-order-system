
export interface IOrderService {
  processOrder(message: any): Promise<void>;
}
