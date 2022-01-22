import * as mongoose from 'mongoose';

export const UserprojectSchema = new mongoose.Schema(
  {
    project_id: { type: String, required: true },
    user_id: { type: Array, required: true },
  },
  { versionKey: false },
);

export interface Userproject extends mongoose.Document {
  project_id: string;
  user_id: string;
}
