import { z } from "zod";

// Esquema para crear un cupón
export const createCouponSchema = z.object({
  code: z
    .string()
    .min(1)
    .transform((val) => val.toUpperCase()),
  discount: z.number().min(0).max(100),
  expiry: z.date(),
});

// Esquema para actualizar un cupón
export const updateCouponSchema = createCouponSchema.partial();

// Tipos inferidos para TypeScript
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
