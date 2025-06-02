import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import connectDB from "../../lib/mongodb";
import Client from "../../lib/models/Client";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await connectDB();

  try {
    if (req.method === "GET") {
      const clients = await Client.find({}).sort({ createdAt: -1 });

      res.status(200).json({
        message: "Clients retrieved successfully",
        clients: clients,
      });
    } else if (req.method === "POST") {
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

      // Check if client with this email already exists
      const existingClient = await Client.findOne({ email });
      if (existingClient) {
        return res.status(400).json({
          error: "A client with this email already exists",
        });
      }

      const client = await Client.create({
        name,
        email,
        phone,
        company,
        industry,
        website,
        address,
        description,
      });

      res.status(201).json({
        message: "Client created successfully",
        client,
      });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
