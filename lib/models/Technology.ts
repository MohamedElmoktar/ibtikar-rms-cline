import mongoose, { Schema, Document } from "mongoose";

export interface ITechnology extends Document {
  name: string;
  category: string;
  description?: string;
  icon?: string;
  color?: string;
  website?: string;
  version?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TechnologySchema = new Schema<ITechnology>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    version: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Technology ||
  mongoose.model<ITechnology>("Technology", TechnologySchema);
