'use strict';
import express from 'express';
var router = express.Router();

router.post('/logout', (req, res) => {
	res.cookie('token', '').send();
});

export { router as logoutRoutes };
