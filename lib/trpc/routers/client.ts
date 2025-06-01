import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import Client from "../../models/Client";
import { clientSchema } from "../../validations";

export const clientRouter = router({
  // Get all clients with pagination
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
          { industry: { $regex: search, $options: "i" } },
          { contactPerson: { $regex: search, $options: "i" } },
        ];
      }

      const [clients, total] = await Promise.all([
        Client.find(filter)
          .populate("country", "name code")
          .populate("createdBy", "firstName lastName")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Client.countDocuments(filter),
      ]);

      return {
        clients,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }),

  // Get count of clients
  getCount: protectedProcedure.query(async () => {
    return await Client.countDocuments();
  }),

  // Get client by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const client = await Client.findById(input.id)
        .populate("country")
        .populate("createdBy", "firstName lastName");

      if (!client) {
        throw new Error("Client not found");
      }

      return client;
    }),

  // Create new client
  create: protectedProcedure
    .input(clientSchema)
    .mutation(async ({ input, ctx }) => {
      const client = new Client({
        ...input,
        createdBy: ctx.session.user.id,
      });

      await client.save();
      return client;
    }),

  // Update client
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: clientSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      const client = await Client.findByIdAndUpdate(input.id, input.data, {
        new: true,
      });

      if (!client) {
        throw new Error("Client not found");
      }

      return client;
    }),

  // Delete client
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const client = await Client.findByIdAndDelete(input.id);

      if (!client) {
        throw new Error("Client not found");
      }

      return { success: true };
    }),
});
