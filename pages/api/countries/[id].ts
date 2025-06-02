import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import connectDB from "../../../lib/mongodb";
import Country from "../../../lib/models/Country";
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
    return res.status(400).json({ error: "Invalid country ID" });
  }

  await connectDB();

  try {
    if (req.method === "GET") {
      const country = await Country.findById(id);

      if (!country) {
        return res.status(404).json({ error: "Country not found" });
      }

      res.status(200).json({ country });
    } else if (req.method === "PUT") {
      const { name, code, flag } = req.body;

      if (!name || !flag) {
        return res.status(400).json({
          error: "Name and flag are required",
        });
      }

      const country = await Country.findByIdAndUpdate(
        id,
        {
          name,
          code,
          flag,
        },
        { new: true, runValidators: true }
      );

      if (!country) {
        return res.status(404).json({ error: "Country not found" });
      }

      res.status(200).json({
        message: "Country updated successfully",
        country,
      });
    } else if (req.method === "DELETE") {
      const country = await Country.findByIdAndDelete(id);

      if (!country) {
        return res.status(404).json({ error: "Country not found" });
      }

      res.status(200).json({ message: "Country deleted successfully" });
    } else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
