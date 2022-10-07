'use strict';
import express from 'express';
import mongoose from 'mongoose';
var router = express.Router();
import jwt from 'jsonwebtoken';
import Record from '../models/Record.js';

const confidential = 'confidential1234';

router.get('/records', (req, res) => {
	if (!req.cookies.token) {
		return res.status(400).json([]);
	}
	const datapack = jwt.verify(req.cookies.token, confidential);
	Record.where({ user: new mongoose.Types.ObjectId(datapack.id) }).find(
		(err, records) => {
			res.json(records);
		}
	);
});

router.post('/records', (req, res) => {
	const datapack = jwt.verify(req.cookies.token, confidential);
	Record.findOneAndDelete(
		{
			_id: new mongoose.Types.ObjectId(req.body.id),
			user: new mongoose.Types.ObjectId(datapack.id),
		},
		{
			del: req.body.del,
		}
	).then(() => {
		res.sendStatus(200);
	});
});

router.put('/records', (req, res) => {
	const datapack = jwt.verify(req.cookies.token, confidential);
	const record = new Record({
		text: req.body.text,
		entryDate: req.body.date,
		del: false,
		user: new mongoose.Types.ObjectId(datapack.id),
		mood: req.body.mood,
	});
	record.save().then((record) => {
		res.json(record);
	});
});

export { router as recordRoutes };
