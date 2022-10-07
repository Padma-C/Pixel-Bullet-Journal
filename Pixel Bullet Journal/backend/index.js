import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { userRoutes } from './routes/userRoutes.js';
import { recordRoutes } from './routes/recordRoutes.js';
import { registerRoutes } from './routes/registerRoutes.js';
import { loginRoutes } from './routes/sessionRoutes/loginRoutes.js';
import { logoutRoutes } from './routes/sessionRoutes/logoutRoutes.js';

import 'dotenv/config';
const port = process.env.PORT || 8080;

const confidential = 'confidential1234';

const connectDatabase = async () => {
	try {
		mongoose.connect(process.env.DATABASE_CREDS, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('connected to database');
	} catch (error) {
		console.log('error');
	}
};

connectDatabase();
const app = express();

app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));
app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:3000',
	})
);

app.get('/', (req, res) => {
	res.status(200).json({ message: 'Everything is ok' });
});

app.use('/', userRoutes);
app.use('/', recordRoutes);
app.use('/', registerRoutes);
app.use('/', loginRoutes);
app.use('/', logoutRoutes);

app.listen(port, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`Server is running on ${port}`);
	}
});
