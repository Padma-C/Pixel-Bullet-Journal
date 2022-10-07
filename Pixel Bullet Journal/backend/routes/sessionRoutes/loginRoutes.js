'use strict';
import express from 'express';
var router = express.Router();
import User from '../../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const confidential = 'confidential1234';

router.post('/login', (req, res) => {
	const { email, password } = req.body;
	User.findOne({ email }).then((userData) => {
		if (!userData) {
			return res.sendStatus(401);
		}
		const passOk = bcrypt.compareSync(password, userData.password);
		if (passOk) {
			jwt.sign(
				{ id: userData._id, email },
				confidential,
				(err, token) => {
					if (err) {
						console.log(err);
						res.sendStatus(500);
					} else {
						res.cookie('token', token).json({
							id: userData._id,
							email: userData.email,
						});
					}
				}
			);
		} else {
			res.sendStatus(401);
		}
	});
});

export { router as loginRoutes };
