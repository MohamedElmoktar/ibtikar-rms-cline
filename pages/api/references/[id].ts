import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import connectDB from "../../../lib/mongodb";
import Reference from "../../../lib/models/Reference";
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
    return res.status(400).json({ error: "Invalid reference ID" });
  }

  await connectDB();

  try {
    if (req.method === "GET") {
      // Get a specific reference
      const reference = await Reference.findById(id)
        .populate("client", "name industry")
        .populate("technologies", "name category")
        .populate("country", "name flag")
        .populate("createdBy", "firstName lastName email");

      if (!reference) {
        return res.status(404).json({ error: "Reference not found" });
      }

      res.status(200).json({ reference });
    } else if (req.method === "PUT") {
      // Update a reference
      const {
        title,
        description,
        client,
        technologies,
        country,
        status,
        startDate,
        endDate,
        projectUrl,
        githubUrl,
        features,
        challenges,
        results,
        testimonial,
        files,
      } = req.body;

      // Validation
      if (!title || !description || !client) {
        return res.status(400).json({
          error: "Title, description, and client are required",
        });
      }

      // Check if reference exists and user has permission to edit
      const existingReference = await Reference.findById(id);
      if (!existingReference) {
        return res.status(404).json({ error: "Reference not found" });
      }

      // For now, allow any authenticated user to edit
      // In production, you might want to check if user is the creator or has admin rights
      // if (existingReference.createdBy.toString() !== session.user.id) {
      //   return res.status(403).json({ error: "Not authorized to edit this reference" });
      // }

      const updateData: any = {
        title,
        description,
        client,
        technologies: technologies || [],
        status: status || "Actif",
        features: features || [],
      };

      // Add optional fields if provided
      if (country) updateData.country = country;
      if (startDate) updateData.startDate = new Date(startDate);
      if (endDate) updateData.endDate = new Date(endDate);
      if (projectUrl) updateData.projectUrl = projectUrl;
      if (githubUrl) updateData.githubUrl = githubUrl;
      if (challenges) updateData.challenges = challenges;
      if (results) updateData.results = results;
      if (files) updateData.files = files;

      // Handle testimonial
      if (
        testimonial &&
        (testimonial.content || testimonial.author || testimonial.position)
      ) {
        updateData.testimonial = testimonial;
      }

      const updatedReference = await Reference.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )
        .populate("client", "name industry")
        .populate("technologies", "name category")
        .populate("country", "name flag")
        .populate("createdBy", "firstName lastName email");

      res.status(200).json({
        message: "Reference updated successfully",
        reference: updatedReference,
      });
    } else if (req.method === "DELETE") {
      // Delete a reference
      const existingReference = await Reference.findById(id);
      if (!existingReference) {
        return res.status(404).json({ error: "Reference not found" });
      }

      // Check permission (for now, allow any authenticated user)
      // if (existingReference.createdBy.toString() !== session.user.id) {
      //   return res.status(403).json({ error: "Not authorized to delete this reference" });
      // }

      await Reference.findByIdAndDelete(id);

      res.status(200).json({ message: "Reference deleted successfully" });
    } else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
