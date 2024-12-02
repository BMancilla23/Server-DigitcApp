import { z } from "zod";

export const createCategorySchema = z
  .object({
    title: z
      .string()
      .min(2, "Title must be at least 3 characters long")
      .max(50, "Title must be at most 50 characters"),
  })
  .strict();

export const updateCategorySchema = createCategorySchema.partial().strict();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
