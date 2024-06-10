import jwt from 'jsonwebtoken';
import { tokenVerificationErrors } from '../utils/tokenManager.js';

// export const requireToken = (req, res, next) => {
//     try {
//         let token = req.cookies.token;

//         if (!token) throw new Error('No Bearer');

//         //token = token.split(" ")[1];
        
//         const {uid} = jwt.verify(token, process.env.JWT_SECRET);
//         req.uid = uid;

//         next();
//     } catch (error) {
//         console.log(error);

//         const tokenVerificationErrors = {
//             "invalid signature": "La firma del JWT no es válida",
//             "jwt expired": "JWT expirado",
//             "invalid token": "Token no válido",
//             "No Bearer": "Utiliza formato bear",
//             "jwt malformed": "JWT formato no válido"
//         };

//         return res.status(401).json({error: tokenVerificationErrors[error.message]});
//     }
// }

export const requireToken = (req, res, next) => {
    try {
        let token = req.headers?.authorization;

        if (!token) throw new Error('No Bearer');

        token = token.split(" ")[1];
        
        const {uid} = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({error: tokenVerificationErrors[error.message]});
    }
}
