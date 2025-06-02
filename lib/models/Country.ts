import mongoose, { Schema, Document } from "mongoose";

export interface ICountry extends Document {
  name: string;
  code: string;
  flag: string;
  continent: string;
  currency?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CountrySchema = new Schema<ICountry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    flag: {
      type: String,
      required: true,
    },
    continent: {
      type: String,
      required: true,
      trim: true,
    },
    currency: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Country ||
  mongoose.model<ICountry>("Country", CountrySchema);
