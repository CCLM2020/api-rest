import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";

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
        const {token, expiresIn} = generateToken(user.id)

        generateRefreshToken(user.id, res)

        return res.json({ ok: 'login', token, expiresIn});
        //return res.json(generateToken(user.id));
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Error de servidor'});
    }
};

export const infoUser = async (req, res) => {
    try {
        const user = await User.findById(req.uid).lean(); //con lean devuelvo el objeto simple sin todos los metodos de mongoose
        return res.json({email: user.email});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'error de servidor'});
    }
};