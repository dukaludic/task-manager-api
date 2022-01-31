import * as mongoose from 'mongoose';

export const EventassignedSchema = new mongoose.Schema(
  {
    event_id: { type: String, required: true },
    target_id: { type: String, required: true },
    event_target_type: {
      type: String,
      enum: ['task', 'comment', 'blocker', 'project', 'user'],
      required: true,
    },
  },
  { versionKey: false },
);

export interface Eventassigned extends mongoose.Document {
  event_id: string;
  target_id: string;
  event_target_type: string;
}
