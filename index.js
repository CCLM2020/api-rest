import 'dotenv/config';
import './database/connect_db.js';
import express from 'express';
import authRouter from './routes/auth.route.js';
import linkRouter from './routes/link.route.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/links', linkRouter);

// solo para ejemplo de login/token
app.use(express.static('public'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('🔥🔥🔥 http://localhost:' + PORT));