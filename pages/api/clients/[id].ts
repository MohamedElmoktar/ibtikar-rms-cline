import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import connectDB from "../../../lib/mongodb";
import Client from "../../../lib/models/Client";
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
    return res.status(400).json({ error: "Invalid client ID" });
  }

  await connectDB();

  try {
    if (req.method === "GET") {
      const client = await Client.findById(id);

      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      res.status(200).json({ client });
    } else if (req.method === "PUT") {
      const {
        name,
        email,
        phone,
        company,
        industry,
        website,
        address,
        description,
      } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          error: "Name and email are required",
        });
      }

      // Check if another client with this email exists (excluding current client)
      const existingClient = await Client.findOne({
        email,
        _id: { $ne: id },
      });
      if (existingClient) {
        return res.status(400).json({
          error: "A client with this email already exists",
        });
      }

      const client = await Client.findByIdAndUpdate(
        id,
        {
          name,
          email,
          phone,
          company,
          industry,
          website,
          address,
          description,
        },
        { new: true, runValidators: true }
      );

      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      res.status(200).json({
        message: "Client updated successfully",
        client,
      });
    } else if (req.method === "DELETE") {
      const client = await Client.findByIdAndDelete(id);

      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      res.status(200).json({ message: "Client deleted successfully" });
    } else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
