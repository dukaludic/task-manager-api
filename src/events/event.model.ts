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
    event_object_id: { type: String, required: true },
    event_object_type: {
      type: String,
      enum: ['task', 'comment', 'blocker', 'project', 'user'],
      required: true,
    },
    event_target_project_id: { type: String, required: true },
    event_target_id: { type: String, required: true },
    event_target_type: {
      type: String,
      enum: ['task', 'comment', 'blocker', 'project', 'user'],
      required: true,
    },
  },
  { versionKey: false },
);

//dobijaju juzeri koji su assignovani na projekat, smisliti jos
//user mora ima svoju instancu notifikacije

export interface Event extends mongoose.Document {
  user_id: string;
  operation: string;
  date_time: Date;
  event_object_id: string;
  event_object_type: string;
  event_target_project_id: string;
  event_target_id: string;
  event_target_type: string;
}
