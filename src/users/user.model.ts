import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'project_manager', 'worker'],
      required: true,
    },
    profile_picture: { type: String, required: true },
  },
  { versionKey: false },
);

export interface User extends mongoose.Document {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profile_picture: string;
}

//brisati product_id
