import mongoose from 'mongoose';

const Record = mongoose.model(
	'Record',
	new mongoose.Schema({
		text: { type: String, required: true },
		entryDate: { type: Date, default: Date.now, required: true },
		del: { type: mongoose.SchemaTypes.Boolean, required: true },
		user: { type: mongoose.SchemaTypes.ObjectId },
		mood: { type: String },
	})
);

export default Record;
