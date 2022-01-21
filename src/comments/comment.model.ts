import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    date_time: { type: String, required: true },
    content: { type: String, required: true },
    assignment_id: { type: String, required: true },
  },
  { versionKey: false },
);

export interface Comment extends mongoose.Document {
  user_id: string;
  date_time: Date;
  content: string;
  assignment_id: string;
}
