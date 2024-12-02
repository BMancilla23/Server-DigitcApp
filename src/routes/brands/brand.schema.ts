import { z } from "zod";

export const createBrandSchema = z
  .object({
    title: z
      .string()
      .min(2, "Title must be at least 3 characters long")
      .max(50, "Title must be at most 50 characters"),
  })
  .strict();

export const updateBrandSchema = createBrandSchema.partial().strict();

export type CreateBrandInput = z.infer<typeof createBrandSchema>;

export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
