import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:password@rabbitmq:5672';

let channel: amqp.Channel | null = null;

export const connectRabbitMQ = async () => {
  try {
    console.log(`Connecting to RabbitMQ at ${RABBITMQ_URL}`)
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Declarar as filas que vamos usar e garantir que elas existem
    await channel.assertQueue('order_queue', { durable: true });

    console.log('Connected to RabbitMQ and channel created');

  } catch (error: any) {
    console.error('Failed to connect to RabbitMQ', error);
    throw new Error(`RabbitMQ connection failed: ${error?.message}`);
    // Encerrar o processo se a conexão falhar, pois o aplicativo não pode funcionar sem ela
    // process.exit(1);
  }
};

export const publishToQueue = (queueName: string, message: any) => {
  if (!channel) {
    throw new Error('RabbitMQ channel not available. Connect first.');
  }
  
  const messageBuffer = Buffer.from(JSON.stringify(message));
  channel.sendToQueue(queueName, messageBuffer);
  console.log(`Message sent to queue ${queueName}`);
};