import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import dbConnect from "../../lib/mongodb";
import Country from "../../lib/models/Country";
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
        const countries = await Country.find({}).sort({ name: 1 });

        const total = await Country.countDocuments({});

        res.status(200).json({
          countries,
          pagination: {
            total,
          },
        });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch countries" });
      }
      break;

    case "POST":
      try {
        const country = new Country(req.body);
        await country.save();

        res.status(201).json(country);
      } catch (error) {
        res.status(500).json({ error: "Failed to create country" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
