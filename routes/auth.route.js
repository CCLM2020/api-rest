import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { body } from 'express-validator';
import { validationResultExpress } from '../middlewares/validationResultExpress.js';
const router = express.Router();

router.post('/login', [
    body('email', 'Formato de email incorrecto')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 6 }).withMessage('Mínimo 6 caracteres')
], validationResultExpress, login);

router.post('/register', [
    body('email', 'Formato de email incorrecto')
        .trim()
        .isEmail()
        .normalizeEmail(),
    // body('password', 'Mínimo 6 carácteres')
    //     .trim()
    //     .isLength({ min: 6 }),
    // body('password', 'Formato de password incorrecto')
    //     .custom((value, {req}) => {
    //         if(value !== req.body.repassword){
    //             throw new Error('No coinciden las contraseñas');
    //         }
    //         return value;
    //     })
    body('password')
        .trim()
        .isLength({ min: 6 }).withMessage('Mínimo 6 caracteres')
        .custom((value, { req }) => {
            if (value !== req.body.repassword) {
                throw new Error('No coinciden las contraseñas');
            }
            return value;
        })//.withMessage('Formato de password incorrecto')
], validationResultExpress, register);


export default router;