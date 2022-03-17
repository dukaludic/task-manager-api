import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: false },
    date_time: { type: String, required: false },
    content: { type: String, required: false },
    assignment_id: { type: String, required: false },
  },
  { versionKey: false },
);

export interface Comment extends mongoose.Document {
  user_id: string;
  date_time: Date;
  content: string;
  assignment_id: string;
}
