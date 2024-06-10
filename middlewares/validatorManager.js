import { validationResult, body, param } from "express-validator";

export const validationResultExpress = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    next();
};

// export const bodyLinkValidator = [
//     body('longLink', 'Formato link incorrecto')
//     .trim()
//     .notEmpty()
//     .custom(async value=> {
//         console.log('value: ' + value);
//         try {
//             await fetch(value);
//             return value;
//         } catch (error) {
//             //console.log(error);
//             throw new Error('Not found longlink 404');
//         }
//     })
//     //.exists()
//     ,
//     validationResultExpress,
// ];
export const paramsLinkValidator = [
    param('id', 'Formato no válido (expressValidator)')
        .trim()
        .notEmpty()
        .escape() //para sanitizar javascript que envien en '<script></script>
        ,
    validationResultExpress,   
]


export const bodyLinkValidator = [
    body('longLink', 'Formato link incorrecto')
        .trim()
        .notEmpty()
        .isURL({ protocols: ['http','https'], require_protocol: true })
        .withMessage('El link debe ser una URL válida con http o https')
        .custom(async value => {
            console.log('value:', value);
            try {
                const response = await fetch(value);
                if (!response.ok) {
                    throw new Error(`URL responded with status ${response.status}`);
                }
                return true;
            } catch (error) {
                throw new Error('Not found longlink 404');
            }
        }),
    validationResultExpress,
];

export const bodyRegisterValidator = [
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
        }),//.withMessage('Formato de password incorrecto')
    validationResultExpress,
];

export const bodyLoginValidator = [
    body('email', 'Formato de email incorrecto')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
    validationResultExpress,
]