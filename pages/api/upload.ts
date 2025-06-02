import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import formidable from "formidable";
import { promises as fs } from "fs";
import path from "path";
import { authOptions } from "./auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public/uploads");
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB max file size
      multiples: true,
    });

    const [fields, files] = await form.parse(req);

    const uploadedFiles = [];
    const fileArray = Array.isArray(files.files)
      ? files.files
      : files.files
      ? [files.files]
      : [];

    for (const file of fileArray) {
      if (file && file.filepath) {
        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.originalFilename || "upload";
        const extension = path.extname(originalName);
        const baseName = path.basename(originalName, extension);
        const newFileName = `${timestamp}-${baseName}${extension}`;
        const newFilePath = path.join(uploadDir, newFileName);

        // Move file to new location with unique name
        await fs.rename(file.filepath, newFilePath);

        uploadedFiles.push({
          originalName: file.originalFilename,
          fileName: newFileName,
          filePath: `/uploads/${newFileName}`,
          size: file.size,
          mimetype: file.mimetype,
        });
      }
    }

    res.status(200).json({
      success: true,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
}
