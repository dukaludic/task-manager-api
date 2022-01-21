import * as mongoose from 'mongoose';

export const SettingSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  { versionKey: false },
);

export interface Setting extends mongoose.Document {
  user_id: string;
  name: string;
  value: string;
}

//brisati product_id
