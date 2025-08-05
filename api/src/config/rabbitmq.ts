import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672';

export const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        
        // Declarar as filas que vamos usar
        await channel.assertQueue('order_queue', {
            durable: true // A fila sobrevive a reinicializações do RabbitMQ
        });

        await channel.assertQueue('delivery_queue', {
            durable: true
        });

        return { connection, channel };
    } catch (error) {
        console.error('Erro ao conectar com RabbitMQ:', error);
        throw error;
    }
};

export const publishToQueue = async (channel: amqp.Channel, queue: string, message: any) => {
    try {
        const messageBuffer = Buffer.from(JSON.stringify(message));
        return channel.sendToQueue(queue, messageBuffer, {
            persistent: true // Garante que a mensagem não será perdida se o RabbitMQ reiniciar
        });
    } catch (error) {
        console.error('Erro ao publicar mensagem:', error);
        throw error;
    }
}; 