import * as mongoose from 'mongoose';

export const ImageSchema = new mongoose.Schema(
  {
    file_url: { type: String, required: false },
    base_64: { type: String, required: false },
  },
  { versionKey: false },
);

export interface Image extends mongoose.Document {
  file_url: string;
  base_64: string;
}
