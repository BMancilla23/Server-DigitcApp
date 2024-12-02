import { Types } from "mongoose";
import { z, ZodSchema } from "zod";

// Esquema de Zod para validar un ObjectId en Request y middleware
export const objectIdSchema: ZodSchema<{ id: string }> = z.object({
  id: z.string().refine((id) => Types.ObjectId.isValid(id), {
    message: "Invalid ID format. Please provide a valid ObjectId.",
  }),
});

export type ObjectIdRequest = z.infer<typeof objectIdSchema>;

// Validar paremetros de services y ObjectId de ref
export const objectIdValid = z
  .string()
  .refine((id) => Types.ObjectId.isValid(id), {
    message: "Invalid ID format. Please provide a valid ObjectId.",
  });

export type ObjectIdInput = z.infer<typeof objectIdValid>;
