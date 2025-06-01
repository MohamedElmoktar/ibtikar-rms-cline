import mongoose, { Document, Schema } from "mongoose";

export interface ITechnology extends Document {
  name: string;
  category?: string;
  description?: string;
  version?: string;
  color?: string;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TechnologySchema = new Schema<ITechnology>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      trim: true,
      enum: [
        "Frontend",
        "Backend",
        "Database",
        "DevOps",
        "Mobile",
        "Cloud",
        "Framework",
        "Library",
        "Tool",
        "Other",
      ],
    },
    description: {
      type: String,
      trim: true,
    },
    version: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
TechnologySchema.index({ name: 1 });
TechnologySchema.index({ category: 1 });
TechnologySchema.index({ isActive: 1 });

export default mongoose.models.Technology ||
  mongoose.model<ITechnology>("Technology", TechnologySchema);
