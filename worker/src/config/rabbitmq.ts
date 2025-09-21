
import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:password@rabbitmq:5672';

let channel: amqp.Channel | null = null;

export const connectRabbitMQ = async () => {
  try {
    console.log(`Connecting to RabbitMQ at ${RABBITMQ_URL}`)
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    
    await channel.assertQueue('order_queue', { durable: true });

    console.log('Connected to RabbitMQ and channel created');

  } catch (error: any) {
    console.error('Failed to connect to RabbitMQ', error);
    throw new Error(`RabbitMQ connection failed: ${error?.message}`);
  }
};

export const consumeFromQueue = (queueName: string, callback: (message: amqp.ConsumeMessage | null) => void) => {
  if (!channel) {
    throw new Error('RabbitMQ channel not available. Connect first.');
  }

  // noAck : falso pq queremos garantir que a mensagem seja processada antes de ser removida da fila
  channel.consume(queueName, callback, { noAck: false });
  console.log(`Started consuming from queue ${queueName}`);
};

// Função para reconhecer (acknowledge) a mensagem após o processamento bem-sucedido
export const acknowledgeMessage = (message: amqp.ConsumeMessage) => {
    if (channel) {
        channel.ack(message);
    }
};
