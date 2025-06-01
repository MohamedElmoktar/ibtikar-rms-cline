import mongoose, { Document, Schema } from "mongoose";

export interface IDocument {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  uploadedAt: Date;
}

export interface IReference extends Document {
  title: string;
  description: string;
  client: mongoose.Types.ObjectId;
  country: mongoose.Types.ObjectId;
  location?: string;
  numberOfEmployees: number;
  budget?: string;
  status: "En cours" | "Completed";
  priority: "High" | "Medium" | "Low";
  responsible: mongoose.Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  technologies: mongoose.Types.ObjectId[];
  keywords: string[];
  screenshots: IDocument[];
  completionCertificate?: IDocument;
  otherDocuments: IDocument[];
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const ReferenceSchema = new Schema<IReference>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    numberOfEmployees: {
      type: Number,
      required: true,
      min: 1,
    },
    budget: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["En cours", "Completed"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
    },
    responsible: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    technologies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Technology",
      },
    ],
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    screenshots: [DocumentSchema],
    completionCertificate: DocumentSchema,
    otherDocuments: [DocumentSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

// Create indexes for better query performance
ReferenceSchema.index({ title: "text", description: "text", keywords: "text" });
ReferenceSchema.index({ client: 1 });
ReferenceSchema.index({ country: 1 });
ReferenceSchema.index({ status: 1 });
ReferenceSchema.index({ priority: 1 });
ReferenceSchema.index({ responsible: 1 });
ReferenceSchema.index({ startDate: -1 });
ReferenceSchema.index({ endDate: -1 });
ReferenceSchema.index({ technologies: 1 });
ReferenceSchema.index({ isDeleted: 1 });
ReferenceSchema.index({ createdAt: -1 });

// Virtual for full name
ReferenceSchema.virtual("clientName", {
  ref: "Client",
  localField: "client",
  foreignField: "_id",
  justOne: true,
});

ReferenceSchema.virtual("countryName", {
  ref: "Country",
  localField: "country",
  foreignField: "_id",
  justOne: true,
});

ReferenceSchema.virtual("responsibleName", {
  ref: "User",
  localField: "responsible",
  foreignField: "_id",
  justOne: true,
});

// Ensure virtual fields are serialized
ReferenceSchema.set("toJSON", { virtuals: true });

export default mongoose.models.Reference ||
  mongoose.model<IReference>("Reference", ReferenceSchema);
