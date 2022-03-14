import * as mongoose from 'mongoose';

export const SubtaskSchema = new mongoose.Schema(
  {
    task_id: { type: String, required: false },
    content: { type: String, required: false },
    done: { type: Boolean, required: false },
  },
  { versionKey: false },
);

export interface Subtask extends mongoose.Document {
  task_id: string;
  content: string;
  done: boolean;
}
