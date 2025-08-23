
import { connectRabbitMQ, consumeFromQueue, acknowledgeMessage } from './config/rabbitmq';
import connectDB from './config/database';
import { OrderService } from './services/OrderService';
import { OrderRepository } from './repositories/OrderRepository';
import amqp from 'amqplib';

const startWorker = async () => {
  await connectDB();
  await connectRabbitMQ();

  const orderRepository = new OrderRepository();
  const orderService = new OrderService(orderRepository);

  consumeFromQueue('order_queue', async (message: amqp.ConsumeMessage | null) => {
    if (message) {
      try {
        const content = JSON.parse(message.content.toString());
        await orderService.processOrder(content);
        acknowledgeMessage(message);
      } catch (error) {
        console.error('Error processing message:', error);
        // Optionally, you can reject the message and send it to a dead-letter queue
      }
    }
  });
};

startWorker();
