import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import connectDB from "../../../lib/mongodb";
import Technology from "../../../lib/models/Technology";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid technology ID" });
  }

  await connectDB();

  try {
    if (req.method === "GET") {
      const technology = await Technology.findById(id);

      if (!technology) {
        return res.status(404).json({ error: "Technology not found" });
      }

      res.status(200).json({ technology });
    } else if (req.method === "PUT") {
      const { name, category, description, version, website, documentation } =
        req.body;

      if (!name || !category) {
        return res.status(400).json({
          error: "Name and category are required",
        });
      }

      const technology = await Technology.findByIdAndUpdate(
        id,
        {
          name,
          category,
          description,
          version,
          website,
          documentation,
        },
        { new: true, runValidators: true }
      );

      if (!technology) {
        return res.status(404).json({ error: "Technology not found" });
      }

      res.status(200).json({
        message: "Technology updated successfully",
        technology,
      });
    } else if (req.method === "DELETE") {
      const technology = await Technology.findByIdAndDelete(id);

      if (!technology) {
        return res.status(404).json({ error: "Technology not found" });
      }

      res.status(200).json({ message: "Technology deleted successfully" });
    } else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
