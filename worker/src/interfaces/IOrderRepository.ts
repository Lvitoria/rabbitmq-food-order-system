
export interface IOrderRepository {
  update(id: string, data: any): Promise<any>;
}
