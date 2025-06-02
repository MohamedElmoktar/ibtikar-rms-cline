import mongoose, { Schema, Document } from "mongoose";

export interface IReference extends Document {
  title: string;
  description: string;
  client: mongoose.Types.ObjectId;
  technologies: mongoose.Types.ObjectId[];
  country: mongoose.Types.ObjectId;
  status: "Actif" | "Terminé" | "En pause" | "Annulé";
  startDate?: Date;
  endDate?: Date;
  projectUrl?: string;
  githubUrl?: string;
  images?: string[];
  files?: {
    originalName: string;
    fileName: string;
    filePath: string;
    size: number;
    mimetype: string;
    uploadDate: Date;
  }[];
  features?: string[];
  challenges?: string;
  results?: string;
  testimonial?: {
    content: string;
    author: string;
    position: string;
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReferenceSchema = new Schema<IReference>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
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
    technologies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Technology",
      },
    ],
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    status: {
      type: String,
      enum: ["Actif", "Terminé", "En pause", "Annulé"],
      default: "Actif",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    projectUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    files: [
      {
        originalName: {
          type: String,
          required: true,
        },
        fileName: {
          type: String,
          required: true,
        },
        filePath: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
          required: true,
        },
        mimetype: {
          type: String,
          required: true,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    challenges: {
      type: String,
      trim: true,
    },
    results: {
      type: String,
      trim: true,
    },
    testimonial: {
      content: {
        type: String,
        trim: true,
      },
      author: {
        type: String,
        trim: true,
      },
      position: {
        type: String,
        trim: true,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Reference ||
  mongoose.model<IReference>("Reference", ReferenceSchema);
