import * as mongoose from 'mongoose';

export const SubtaskSchema = new mongoose.Schema(
  {
    task_id: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: Boolean, required: true },
  },
  { versionKey: false },
);

export interface Subtask extends mongoose.Document {
  task_id: string;
  content: string;
  status: boolean;
}
