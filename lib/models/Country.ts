import mongoose, { Document, Schema } from "mongoose";

export interface ICountry extends Document {
  name: string;
  code: string;
  continent?: string;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CountrySchema = new Schema<ICountry>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 3,
    },
    continent: {
      type: String,
      trim: true,
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
CountrySchema.index({ name: 1 });
CountrySchema.index({ code: 1 });
CountrySchema.index({ isActive: 1 });
CountrySchema.index({ continent: 1 });

export default mongoose.models.Country ||
  mongoose.model<ICountry>("Country", CountrySchema);
