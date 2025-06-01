import { IncomingForm, File } from "formidable";
import { NextApiRequest } from "next";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "10485760"); // 10MB
const UPLOAD_DIR = "./public/uploads";

// Allowed file types
const ALLOWED_TYPES = {
  images: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
};

export interface UploadedFile {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
}

export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Create subdirectories
  const subdirs = ["screenshots", "certificates", "documents"];
  subdirs.forEach((subdir) => {
    const dirPath = path.join(UPLOAD_DIR, subdir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
}

export function parseForm(req: NextApiRequest): Promise<{
  fields: any;
  files: any;
}> {
  return new Promise((resolve, reject) => {
    ensureUploadDir();

    const form = new IncomingForm({
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE,
      multiples: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
}

export function validateFileType(
  mimetype: string,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(mimetype);
}

export function processUploadedFile(
  file: File,
  category: "screenshots" | "certificates" | "documents"
): UploadedFile {
  const fileExtension = path.extname(file.originalFilename || "");
  const filename = `${uuidv4()}${fileExtension}`;
  const categoryDir = path.join(UPLOAD_DIR, category);
  const newPath = path.join(categoryDir, filename);

  // Move file to appropriate category directory
  fs.renameSync(file.filepath, newPath);

  return {
    filename,
    originalName: file.originalFilename || "",
    mimetype: file.mimetype || "",
    size: file.size,
    path: `/uploads/${category}/${filename}`,
  };
}

export function deleteFile(filePath: string): boolean {
  try {
    const fullPath = path.join("./public", filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}

export function getFileUrl(filePath: string): string {
  return filePath.startsWith("/") ? filePath : `/${filePath}`;
}

export function isImageFile(mimetype: string): boolean {
  return ALLOWED_TYPES.images.includes(mimetype);
}

export function isDocumentFile(mimetype: string): boolean {
  return ALLOWED_TYPES.documents.includes(mimetype);
}

export function getAllowedTypes(): typeof ALLOWED_TYPES {
  return ALLOWED_TYPES;
}
