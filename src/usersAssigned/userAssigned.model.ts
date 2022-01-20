import * as mongoose from 'mongoose';

export const UserassignedSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    userassigned_id: { type: String, required: true },
  },
  { versionKey: false },
);

export interface Userassigned extends mongoose.Document {
  title: string;
  tasks: string[];
  userassigned_manager_id: string;
  assigned_users: string[];
  start_date: Date;
  end_date: Date;
}
