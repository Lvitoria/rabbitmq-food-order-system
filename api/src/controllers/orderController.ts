import { Request, Response } from 'express';
import { IOrderService } from '../interfaces/IOrderService';

export class OrderController {
    private orderService: IOrderService;

    constructor(orderService: IOrderService) {
        this.orderService = orderService;
    }

    createOrder = async (req: Request, res: Response) => {
        try {
            const { name, quantity, unitPrice } = req.body;
            const order = await this.orderService.createOrder({ name, quantity, unitPrice });
            return res.status(201).json({
                success: true,
                data: order
            });
        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            return res.status(500).json({
                success: false,
                error: 'Erro ao criar pedido',
                stack: error instanceof Error ? error.stack : undefined
            });
        }
    };

    getOrders = async (req: Request, res: Response) => {
        try {
            const orders = await this.orderService.getOrders();
            return res.status(200).json({
                success: true,
                count: orders.length,
                data: orders
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Erro ao buscar pedidos'
            });
        }
    };

    getOrderById = async (req: Request, res: Response) => {
        try {
            const order = await this.orderService.getOrderById(req.params.id);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: 'Pedido não encontrado'
                });
            }
            return res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Erro ao buscar pedido'
            });
        }
    };
}
