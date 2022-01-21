import * as mongoose from 'mongoose';

export const ImageSchema = new mongoose.Schema(
  {
    file_url: { type: String, required: true },
    base_64: { type: String, required: true },
  },
  { versionKey: false },
);

export interface Image extends mongoose.Document {
  file_url: string;
  base_64: string;
}
