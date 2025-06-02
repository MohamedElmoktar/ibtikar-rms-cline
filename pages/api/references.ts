import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import dbConnect from "../../lib/mongodb";
import Reference from "../../lib/models/Reference";
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
        const {
          page = 1,
          limit = 10,
          search = "",
          client,
          technology,
          country,
          status,
        } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        // Build filter object
        const filter: any = {};

        if (search) {
          filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ];
        }

        if (client) filter.client = client;
        if (technology) filter.technologies = { $in: [technology] };
        if (country) filter.country = country;
        if (status) filter.status = status;

        const references = await Reference.find(filter)
          .populate("client")
          .populate("technologies")
          .populate("country")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit));

        const total = await Reference.countDocuments(filter);

        res.status(200).json({
          references,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch references" });
      }
      break;

    case "POST":
      try {
        const reference = new Reference({
          ...req.body,
          createdBy: session.user.id,
        });

        await reference.save();
        await reference.populate(["client", "technologies", "country"]);

        res.status(201).json(reference);
      } catch (error) {
        res.status(500).json({ error: "Failed to create reference" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
