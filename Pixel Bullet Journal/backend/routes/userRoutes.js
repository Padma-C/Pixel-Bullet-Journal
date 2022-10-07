'use strict';
import express from 'express';
var router = express.Router();
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const confidential = 'confidential1234';

router.get('/user', (req, res) => {
	if (!req.cookies.token) {
		return res.json({});
	}
	const datapack = jwt.verify(req.cookies.token, confidential);
	User.findById(datapack.id).then((userData) => {
		if (!userData) {
			return res.json({});
		}
		res.json({ id: userData._id, email: userData.email });
	});
});

export { router as userRoutes };
