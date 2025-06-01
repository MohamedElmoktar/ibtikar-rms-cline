import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import Country from "../../models/Country";
import { countrySchema } from "../../validations";

export const countryRouter = router({
  // Get all countries with pagination
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, search } = input;
      const skip = (page - 1) * limit;

      const filter: any = {};
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
        ];
      }

      const [countries, total] = await Promise.all([
        Country.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
        Country.countDocuments(filter),
      ]);

      return {
        countries,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }),

  // Get count of countries
  getCount: protectedProcedure.query(async () => {
    return await Country.countDocuments();
  }),

  // Get country by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const country = await Country.findById(input.id);

      if (!country) {
        throw new Error("Country not found");
      }

      return country;
    }),

  // Create new country
  create: protectedProcedure
    .input(countrySchema)
    .mutation(async ({ input }) => {
      const country = new Country(input);
      await country.save();
      return country;
    }),

  // Update country
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: countrySchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      const country = await Country.findByIdAndUpdate(input.id, input.data, {
        new: true,
      });

      if (!country) {
        throw new Error("Country not found");
      }

      return country;
    }),

  // Delete country
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const country = await Country.findByIdAndDelete(input.id);

      if (!country) {
        throw new Error("Country not found");
      }

      return { success: true };
    }),
});
