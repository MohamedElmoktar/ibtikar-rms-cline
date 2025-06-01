import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import Reference from "../../models/Reference";
import { referenceSchema } from "../../validations";

export const referenceRouter = router({
  // Get all references with pagination and filtering
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        status: z.enum(["En cours", "Completed"]).optional(),
        priority: z.enum(["High", "Medium", "Low"]).optional(),
        clientId: z.string().optional(),
        countryId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, search, status, priority, clientId, countryId } =
        input;
      const skip = (page - 1) * limit;

      // Build filter object
      const filter: any = {};

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (clientId) filter.client = clientId;
      if (countryId) filter.country = countryId;

      const [references, total] = await Promise.all([
        Reference.find(filter)
          .populate("client", "name")
          .populate("country", "name")
          .populate("technologies", "name")
          .populate("createdBy", "firstName lastName")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Reference.countDocuments(filter),
      ]);

      return {
        references,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }),

  // Get count of references
  getCount: protectedProcedure.query(async () => {
    return await Reference.countDocuments();
  }),

  // Get reference by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const reference = await Reference.findById(input.id)
        .populate("client")
        .populate("country")
        .populate("technologies")
        .populate("createdBy", "firstName lastName");

      if (!reference) {
        throw new Error("Reference not found");
      }

      return reference;
    }),

  // Create new reference
  create: protectedProcedure
    .input(referenceSchema)
    .mutation(async ({ input, ctx }) => {
      const reference = new Reference({
        ...input,
        createdBy: ctx.session.user.id,
      });

      await reference.save();
      return reference;
    }),

  // Update reference
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: referenceSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      const reference = await Reference.findByIdAndUpdate(
        input.id,
        input.data,
        { new: true }
      );

      if (!reference) {
        throw new Error("Reference not found");
      }

      return reference;
    }),

  // Delete reference
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const reference = await Reference.findByIdAndDelete(input.id);

      if (!reference) {
        throw new Error("Reference not found");
      }

      return { success: true };
    }),
});
