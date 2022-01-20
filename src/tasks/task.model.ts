import * as mongoose from 'mongoose';

export const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    project_id: { type: String, required: true },
    assigned_users: { type: Array, required: true },
    project_manager_id: { type: String, required: true },
    sub_tasks: { type: Array, required: true },
    status: {
      type: String,
      enum: ['to_do', 'in_progress', 'in_review', 'done'],
      required: true,
    },
  },
  { versionKey: false },
);

export interface Task extends mongoose.Document {
  title: string;
  project_id: string;
  assigned_users: string[];
  project_manager_id: string;
  sub_tasks: string[];
  status: string;
}
