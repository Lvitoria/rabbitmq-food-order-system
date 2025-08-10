import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { v4 as uuidv4 } from 'uuid';
import { connectToRabbitMQ, publishToQueue } from '../config/rabbitmq';

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

        // Conectar ao RabbitMQ
        const { connection, channel } = await connectToRabbitMQ();

        // Publicar o pedido na fila
        await publishToQueue(channel, 'order_queue', {
            orderId: order.id,
            ...order.originalRequest
        });

        // Fechar a conexão
        await connection.close();

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

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({}, { status: 0 }).sort({ createdAt: -1 });
        console.log(orders)
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