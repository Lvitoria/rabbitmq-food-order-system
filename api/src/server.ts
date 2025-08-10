import 'dotenv/config';
import express from 'express';
import connectDB from './config/database';
import orderRoutes from './routes/orderRoutes';

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.get('/api/health', (req, res) => {
    console.log('Health check!!');
    res.json({
        success: true,
        message: 'API de Pedidos funcionando!',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/orders', orderRoutes);



app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
}); 