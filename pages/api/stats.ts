import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import dbConnect from "../../lib/mongodb";
import Reference from "../../lib/models/Reference";
import Client from "../../lib/models/Client";
import Technology from "../../lib/models/Technology";
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

  if (req.method === "GET") {
    try {
      const [referencesCount, clientsCount, technologiesCount, countriesCount] =
        await Promise.all([
          Reference.countDocuments({}),
          Client.countDocuments({}),
          Technology.countDocuments({}),
          Country.countDocuments({}),
        ]);

      res.status(200).json({
        references: referencesCount,
        clients: clientsCount,
        technologies: technologiesCount,
        countries: countriesCount,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
