import * as mongoose from 'mongoose';

export const CommentassignedSchema = new mongoose.Schema(
  {
    comment_id: { type: String, required: true },
    assignment_id: { type: String, required: true },
  },
  { versionKey: false },
);

export interface Commentassigned extends mongoose.Document {
  comment_id: string;
  assignment_id: string;
}

//brisati product_id
