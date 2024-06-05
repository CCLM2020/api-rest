import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';

export const register = async(req, res) => {
    const {email, password} = req.body;

    try {
        //alternativa buscando por email
        let user = await User.findOne({email})
        
        if (user) throw ({code: 11000});
        
        user = new User({email, password});
        await user.save();
        //jwt token

        return res.status(201).json({ ok: 'register'});
    } catch (error) {
        console.log(error);
        //alternativa por defecto mongoose
        if(error.code === 11000) {
            return res.status(400).json({error: 'Ya existe este usuario'});
        }
        return res.status(500).json({error: 'Error de servidor'});
    }
};

export const login = async(req, res) => {
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email})
        
        if (!user) return res.status(403).json({ error: 'No exise el usuario'});

        const respuestaPassword = await user.comparePassword(password);

        if (!respuestaPassword) {
            return res.status(403).json({ error: 'Contraseña incorrecta'});
        }

        //generar el token con JWT
        const token = jwt.sign({uid: user._id}, process.env.JWT_SECRET)

        return res.json({ ok: 'login', token: token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Error de servidor'});
    }
};