import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import Technology from "../../models/Technology";
import { technologySchema } from "../../validations";

export const technologyRouter = router({
  // Get all technologies with pagination
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, search, category } = input;
      const skip = (page - 1) * limit;

      const filter: any = {};
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
      if (category) {
        filter.category = category;
      }

      const [technologies, total] = await Promise.all([
        Technology.find(filter)
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Technology.countDocuments(filter),
      ]);

      return {
        technologies,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }),

  // Get count of technologies
  getCount: protectedProcedure.query(async () => {
    return await Technology.countDocuments();
  }),

  // Get technology by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const technology = await Technology.findById(input.id);

      if (!technology) {
        throw new Error("Technology not found");
      }

      return technology;
    }),

  // Create new technology
  create: protectedProcedure
    .input(technologySchema)
    .mutation(async ({ input }) => {
      const technology = new Technology(input);
      await technology.save();
      return technology;
    }),

  // Update technology
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: technologySchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      const technology = await Technology.findByIdAndUpdate(
        input.id,
        input.data,
        {
          new: true,
        }
      );

      if (!technology) {
        throw new Error("Technology not found");
      }

      return technology;
    }),

  // Delete technology
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const technology = await Technology.findByIdAndDelete(input.id);

      if (!technology) {
        throw new Error("Technology not found");
      }

      return { success: true };
    }),

  // Get technology categories
  getCategories: protectedProcedure.query(async () => {
    const categories = await Technology.distinct("category");
    return categories;
  }),
});
