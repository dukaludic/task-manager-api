import * as mongoose from 'mongoose';

export const ImageassignedSchema = new mongoose.Schema(
  {
    assignment_id: { type: String, required: true },
    image_id: { type: String, required: true },
  },
  { versionKey: false },
);

export interface Imageassigned extends mongoose.Document {
  assignment_id: string;
  image_id: string;
}
