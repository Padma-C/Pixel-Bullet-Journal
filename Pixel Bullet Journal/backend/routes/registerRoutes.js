'use strict';
import express from 'express';
var router = express.Router();
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const confidential = 'confidential1234';

router.post('/register', (req, res) => {
	const { email, password } = req.body;
	const encryptedPassword = bcrypt.hashSync(password, 10);
	const user = new User({ password: encryptedPassword, email: email });
	user.save().then((userData) => {
		jwt.sign(
			{ id: userData._id, email: userData.email },
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
	});
});

export { router as registerRoutes };
