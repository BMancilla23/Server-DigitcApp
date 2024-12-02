import { z, ZodSchema } from "zod";
import { objectIdValid } from "../../utils/validators";
import { Types } from "mongoose";

export const objectProductIdSchema: ZodSchema<{ productId: string }> = z.object(
  {
    productId: z.string().refine((id) => Types.ObjectId.isValid(id), {
      message: "Invalid ID format. Please provide a valid ObjectId.",
    }),
  }
);

export const createProductSchema = z
  .object({
    title: z.string({
      message: "Title is required",
    }),
    slug: z.string({
      message: "Slug is required",
    }),
    description: z.string({
      message: "Description is required",
    }),
    price: z.number().positive("Price must be a positive number"),
    /* category: objectIdValid.optional(), */
    category: z.string({
      message: "Category is required",
    }),
    brand: z.string({
      message: "Brand is required",
    }),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
    sold: z.number().int().nonnegative("Sold must be non-negative").optional(),
    images: z.array(z.string().url("Image URL must be valid")).optional(),
    /* color: z.nativeEnum(ProductColor), */
    color: z.string({
      message: "Color is required",
    }),
    ratings: z
      .array(
        z.object({
          star: z.number().int().min(0).max(5),
          postedBy: objectIdValid,
        })
      )
      .optional(),
  })
  .strict()
  .omit({
    slug: true,
  });

export const updateProductSchema = createProductSchema.partial();

export const productsQuerySchema = z
  .object({
    // Preprocess convierte el valor antes de que zod aplique las validaciones, asegurando que page y limit sean tratados coo números a lo largo del proceso

    page: z
      .preprocess(
        (val) => (typeof val === "string" ? parseInt(val, 10) : val),
        z.number().int().positive().optional()
      )
      .refine((val) => !val || val > 0, {
        message: "Page must be a positive integer",
      }),
    limit: z
      .preprocess(
        (val) => (typeof val === "string" ? parseInt(val, 10) : val),
        z.number().int().positive().optional()
      )
      .refine((val) => !val || val > 0, {
        message: "Limit must be a positive integer",
      }),
    sort: z.string().optional(),
    fields: z.string().optional(),

    // Filtros de rangos
    /*  price: z.string().optional(),
    quantity: z.string().optional(),
    sold: z.string().optional(), */

    // Filtros de rangos con preprocess para asegurar que se conviertan en números
    price: z
      .object({
        gte: z.preprocess(
          (val) => (typeof val === "string" ? parseFloat(val) : val),
          z.number().optional()
        ),
        gt: z.preprocess(
          (val) => (typeof val === "string" ? parseFloat(val) : val),
          z.number().optional()
        ),
        lte: z.preprocess(
          (val) => (typeof val === "string" ? parseFloat(val) : val),
          z.number().optional()
        ),
        lt: z.preprocess(
          (val) => (typeof val === "string" ? parseFloat(val) : val),
          z.number().optional()
        ),
      })
      .optional(),

    quantity: z
      .object({
        gte: z.preprocess(
          (val) => (typeof val === "string" ? parseFloat(val) : val),
          z.number().optional()
        ),
        gt: z.preprocess(
          (val) => (typeof val === "string" ? parseFloat(val) : val),
          z.number().optional()
        ),
        lte: z.preprocess(
          (val) => (typeof val === "string" ? parseFloat(val) : val),
          z.number().optional()
        ),
        lt: z.preprocess(
          (val) => (typeof val === "string" ? parseFloat(val) : val),
          z.number().optional()
        ),
      })
      .optional(),

    sold: z
      .object({
        gte: z.preprocess(
          (val) => (typeof val === "string" ? parseFloat(val) : val),
          z.number().optional()
        ),
        gt: z.preprocess(
          (val) => (typeof val === "string" ? parseFloat(val) : val),
          z.number().optional()
        ),
        lte: z.preprocess(
          (val) => (typeof val === "string" ? parseFloat(val) : val),
          z.number().optional()
        ),
        lt: z.preprocess(
          (val) => (typeof val === "string" ? parseFloat(val) : val),
          z.number().optional()
        ),
      })
      .optional(),
  })
  .strict();

export const ratingSchema = z.object({
  star: z.number().int().min(0).max(5).optional().default(0),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export type ProductsQueryInput = z.infer<typeof productsQuerySchema>;

export type ObjectProductIdInput = z.infer<typeof objectProductIdSchema>;

export type RatingInput = z.infer<typeof ratingSchema>;
