import * as mongoose from 'mongoose';

export const EventSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    operation: {
      type: String,
      enum: ['added', 'commented', 'assigned', 'resolved', 'removed'],
      required: true,
    },
    date_time: { type: Date, required: true },
    event_target_id: { type: String, required: true },
    event_target_type: {
      type: String,
      enum: ['task', 'comment', 'blocker', 'project', 'user'],
      required: true,
    },
  },
  { versionKey: false },
);

export interface Event extends mongoose.Document {
  user_id: string;
  operation: string;
  date_time: Date;
  event_target_id: string;
  event_target_type: string;
}
