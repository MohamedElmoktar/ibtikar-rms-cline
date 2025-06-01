import { z } from "zod";

// User validation schemas
export const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  role: z.enum(["admin", "user"]),
  isActive: z.boolean().optional(),
});

export const userUpdateSchema = userSchema.partial().omit({ password: true });

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Authentication schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

// Reference validation schemas
export const referenceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required"),
  client: z.string().min(1, "Client is required"),
  country: z.string().min(1, "Country is required"),
  location: z.string().optional(),
  numberOfEmployees: z
    .number()
    .min(1, "Number of employees must be at least 1"),
  budget: z.string().optional(),
  status: z.enum(["En cours", "Completed"]),
  priority: z.enum(["High", "Medium", "Low"]),
  responsible: z.string().min(1, "Responsible person is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  technologies: z
    .array(z.string())
    .min(1, "At least one technology is required"),
  keywords: z.array(z.string()).optional(),
});

export const referenceUpdateSchema = referenceSchema.partial();

// Client validation schemas
export const clientSchema = z.object({
  name: z.string().min(1, "Client name is required").max(100, "Name too long"),
  description: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const clientUpdateSchema = clientSchema.partial();

// Country validation schemas
export const countrySchema = z.object({
  name: z.string().min(1, "Country name is required").max(100, "Name too long"),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(3, "Code too long")
    .toUpperCase(),
  continent: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const countryUpdateSchema = countrySchema.partial();

// Technology validation schemas
export const technologySchema = z.object({
  name: z
    .string()
    .min(1, "Technology name is required")
    .max(100, "Name too long"),
  category: z
    .enum([
      "Frontend",
      "Backend",
      "Database",
      "DevOps",
      "Mobile",
      "Cloud",
      "Framework",
      "Library",
      "Tool",
      "Other",
    ])
    .optional(),
  description: z.string().optional(),
  version: z.string().optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format")
    .optional(),
  isActive: z.boolean().optional(),
});

export const technologyUpdateSchema = technologySchema.partial();

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().optional(),
  client: z.string().optional(),
  country: z.string().optional(),
  status: z.enum(["En cours", "Completed"]).optional(),
  priority: z.enum(["High", "Medium", "Low"]).optional(),
  responsible: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  startDateFrom: z.string().optional(),
  startDateTo: z.string().optional(),
  endDateFrom: z.string().optional(),
  endDateTo: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  type: z.enum(["screenshot", "certificate", "document"]),
  referenceId: z.string().optional(),
});

export type UserInput = z.infer<typeof userSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ReferenceInput = z.infer<typeof referenceSchema>;
export type ReferenceUpdateInput = z.infer<typeof referenceUpdateSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;
export type CountryInput = z.infer<typeof countrySchema>;
export type CountryUpdateInput = z.infer<typeof countryUpdateSchema>;
export type TechnologyInput = z.infer<typeof technologySchema>;
export type TechnologyUpdateInput = z.infer<typeof technologyUpdateSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
