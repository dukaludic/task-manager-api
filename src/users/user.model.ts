import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: false },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'project_manager', 'worker'],
      required: true,
    },
  },
  { versionKey: false },
);

export interface User extends mongoose.Document {}

//brisati product_id
