import * as mongoose from 'mongoose';

export const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    project_id: { type: String, required: true },
    assigned_users: { type: Array, required: true },

    project_manager_id: { type: String, required: false },
    sub_tasks: { type: Array, required: true },
    status: {
      type: String,
      enum: ['to_do', 'in_progress', 'in_review', 'done'],
      required: true,
    },
    description: { type: String, required: false },
    created_by: { type: String, required: true },
    creation_time: { type: Date, required: true },
    due_date: { type: Date, required: false },
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
  description: string;
  created_by: string;
  creation_time: Date;
  due_date: Date;
}
