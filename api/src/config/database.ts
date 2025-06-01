import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food-order-system';
        
        const options = {
            autoIndex: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            authSource: 'admin',
            user: process.env.MONGODB_USER || 'admin',
            pass: process.env.MONGODB_PASS || 'admin123'
        };

        const conn = await mongoose.connect(mongoURI, options);
        
        console.log(`MongoDB conectado: ${conn.connection.host}`);
        
        mongoose.connection.on('error', (err) => {
            console.error('Erro na conexão com MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB desconectado');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        setTimeout(connectDB, 5000);
    }
};

export default connectDB; 