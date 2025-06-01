import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { v4 as uuidv4 } from 'uuid';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { name, quantity, unitPrice } = req.body;
        const totalValue = quantity * unitPrice;

        const order = await Order.create({
            id: uuidv4(),
            originalRequest: {
                name,
                quantity,
                unitPrice,
                totalValue
            }
        });

        return res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Erro ao criar pedido',
            stack: error instanceof Error ? error.stack : undefined
        });
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({}, { status: 0 }).sort({ createdAt: -1 });
        
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

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await Order.findOne({ id: req.params.id }, { status: 0 });
        
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