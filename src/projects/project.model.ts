import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tasks: { type: Array, required: false },
    project_manager_id: { type: String, required: false },
    assigned_users: { type: Array, required: false },
    start_date: { type: Date, required: false },
    end_date: { type: Date, required: false },
    status: {
      type: String,
      enum: ['to_do', 'in_progress', 'in_review', 'done'],
      required: false,
    },
    description: { type: String, required: false },
  },
  { versionKey: false },
);

export interface Project extends mongoose.Document {
  title: string;
  tasks: string[];
  project_manager_id: string;
  assigned_users: string[];
  start_date: Date;
  end_date: Date;
  status: string;
  description: string;
}
