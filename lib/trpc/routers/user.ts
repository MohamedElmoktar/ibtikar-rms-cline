import { z } from "zod";
import { router, procedure } from "../trpc";
import bcrypt from "bcryptjs";
import User from "../../models/User";
import dbConnect from "../../mongodb";

export const userRouter = router({
  getAll: procedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        role: z.enum(["Admin", "User"]).optional(),
      })
    )
    .query(async ({ input }) => {
      await dbConnect();
      const { page, limit, search, role } = input;
      const skip = (page - 1) * limit;

      const filter: any = {};
      if (search) {
        filter.$or = [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
        ];
      }
      if (role) filter.role = role;

      const [users, total] = await Promise.all([
        User.find(filter)
          .select("-password")
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        User.countDocuments(filter),
      ]);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }),

  getById: procedure.input(z.string()).query(async ({ input }) => {
    await dbConnect();
    const user = await User.findById(input).select("-password").lean();
    return user;
  }),

  getStats: procedure.query(async () => {
    try {
      await dbConnect();
      const [total, active, admins] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        User.countDocuments({ role: "Admin" }),
      ]);

      return {
        total,
        active,
        inactive: total - active,
        admins,
        users: total - admins,
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        admins: 0,
        users: 0,
      };
    }
  }),

  create: procedure
    .input(
      z.object({
        username: z.string().min(3).max(50),
        email: z.string().email(),
        password: z.string().min(6),
        firstName: z.string().max(50).optional(),
        lastName: z.string().max(50).optional(),
        role: z.enum(["Admin", "User"]).default("User"),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      await dbConnect();
      const { password, ...userData } = input;

      // Check if username or email already exists
      const existingUser = await User.findOne({
        $or: [{ username: userData.username }, { email: userData.email }],
      });

      if (existingUser) {
        throw new Error("Username or email already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        ...userData,
        password: hashedPassword,
      });

      await user.save();

      // Return user without password
      const { password: _, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    }),

  update: procedure
    .input(
      z.object({
        id: z.string(),
        username: z.string().min(3).max(50),
        email: z.string().email(),
        firstName: z.string().max(50).optional(),
        lastName: z.string().max(50).optional(),
        role: z.enum(["Admin", "User"]),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      await dbConnect();
      const { id, ...updateData } = input;

      // Check if username or email already exists for other users
      const existingUser = await User.findOne({
        _id: { $ne: id },
        $or: [{ username: updateData.username }, { email: updateData.email }],
      });

      if (existingUser) {
        throw new Error("Username or email already exists");
      }

      const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      })
        .select("-password")
        .lean();

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    }),

  updatePassword: procedure
    .input(
      z.object({
        id: z.string(),
        newPassword: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      await dbConnect();
      const { id, newPassword } = input;

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      const user = await User.findByIdAndUpdate(
        id,
        { password: hashedPassword },
        { new: true }
      )
        .select("-password")
        .lean();

      if (!user) {
        throw new Error("User not found");
      }

      return { success: true };
    }),

  delete: procedure.input(z.string()).mutation(async ({ input }) => {
    await dbConnect();
    const user = await User.findByIdAndDelete(input);

    if (!user) {
      throw new Error("User not found");
    }

    return { success: true };
  }),
});
