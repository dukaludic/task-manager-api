import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tasks: { type: Array, required: true },
    project_manager_id: { type: String, required: true },
    assigned_users: { type: Array, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
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
}
