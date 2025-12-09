import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  ticketId: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);