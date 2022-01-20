import * as mongoose from 'mongoose';

export const BlockerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    task_id: { type: String, required: true },
    description: { type: String, required: true },
    comments: { type: Array, required: true },
    user_id: { type: String, required: true },
  },
  { versionKey: false },
);

export interface Blocker extends mongoose.Document {
  title: string;
  task_id: string;
  description: string;
  comments: string[];
  user_id: string;
}
