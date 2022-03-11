import * as mongoose from 'mongoose';

export const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    project_id: { type: String, required: true },
    assigned_users: { type: Array, required: false },

    project_manager_id: { type: String, required: false },
    sub_tasks: { type: Array, required: false },
    status: {
      type: String,
      enum: ['to_do', 'in_progress', 'in_review', 'done'],
      required: true,
    },
    description: { type: String, required: false },
    created_by: { type: String, required: false },
    creation_time: { type: Date, required: false },
    due_date: { type: Date, required: false },
    approved: { type: Boolean, required: false, default: false },
    approved_by: { type: String, required: false },
    time_approved: { type: Date, required: false },
    time_sent_to_review: { type: Date, required: false },
    still_visible_to_worker: { type: Boolean, required: false },
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
  approved: boolean;
  approved_by: string;
  time_approved: Date;
  time_sent_to_review: Date;
  still_visible_to_worker: Boolean;
}
