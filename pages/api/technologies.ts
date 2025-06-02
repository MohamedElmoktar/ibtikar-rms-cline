import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import dbConnect from "../../lib/mongodb";
import Technology from "../../lib/models/Technology";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const { page = 1, limit = 50, search = "", category } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        // Build filter object
        const filter: any = {};

        if (search) {
          filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ];
        }

        if (category) filter.category = category;

        const technologies = await Technology.find(filter)
          .sort({ name: 1 })
          .skip(skip)
          .limit(Number(limit));

        const total = await Technology.countDocuments(filter);

        res.status(200).json({
          technologies,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch technologies" });
      }
      break;

    case "POST":
      try {
        const technology = new Technology(req.body);
        await technology.save();

        res.status(201).json(technology);
      } catch (error) {
        res.status(500).json({ error: "Failed to create technology" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
