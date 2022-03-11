import * as mongoose from 'mongoose';

export const ReviewSchema = new mongoose.Schema(
  {
    task_id: { type: String, required: true },
    approval: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      required: true,
    },
    reviewed_by: { type: String, required: true },
    reviewed_time: { type: Date, required: false },
    sent_to_review_time: { type: Date, required: true },
    visibility: { type: Boolean, required: true, default: false },
    assignee_id: { type: String, required: true },
    project_id: { type: String, required: true },
  },
  { versionKey: false },
);

export interface Review extends mongoose.Document {
  task_id: string;
  approval: string;
  reviewed_by: string;
  reviewed_time: Date;
  sent_to_review_time: Date;
  visibility: boolean;
  assignee_id: string;
  project_id: string;
}
