import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const orderSchema = Joi.object({
    name: Joi.string().required().min(3).max(100)
        .messages({
            'string.empty': 'O nome não pode estar vazio',
            'string.min': 'O nome deve ter pelo menos 3 caracteres',
            'string.max': 'O nome não pode ter mais de 100 caracteres',
            'any.required': 'O nome é obrigatório'
        }),
    quantity: Joi.number().required().min(1)
        .messages({
            'number.base': 'A quantidade deve ser um número',
            'number.min': 'A quantidade deve ser maior que zero',
            'any.required': 'A quantidade é obrigatória'
        }),
    unitPrice: Joi.number().required().min(0.01)
        .messages({
            'number.base': 'O preço unitário deve ser um número',
            'number.min': 'O preço unitário deve ser maior que zero',
            'any.required': 'O preço unitário é obrigatório'
        })
});

export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
    const { error } = orderSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({ 
            success: false,
            error: 'Erro de validação',
            details: errorMessages
        });
    }
    
    next();
}; 