import * as mongoose from 'mongoose';

export const EventassignedSchema = new mongoose.Schema(
  {
    assignment_project_id: { type: String, required: true },
    assignment_id: { type: String, required: true },
  },
  { versionKey: false },
);

export interface Eventassigned extends mongoose.Document {
  assignment_project_id: string;
  assignment_id: string;
}
