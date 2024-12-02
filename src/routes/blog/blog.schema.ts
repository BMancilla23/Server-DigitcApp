import { Types } from "mongoose";
import { z, ZodSchema } from "zod";
import { objectIdValid } from "./../../utils/validators";

export const objectBlogIdSchema: ZodSchema<{ blogId: string }> = z.object({
  blogId: z.string().refine((id) => Types.ObjectId.isValid(id), {
    message: "Invalid ID format. Please provide a valid ObjectId.",
  }),
});

export const createBlogSchema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters long"),
    content: z.string().min(10, "Content must be at least 10 characters long"),
    category: z.string().min(4, "Categoy is required"),
    views: z.number().int().nonnegative().default(0).optional(),
    isLiked: z.boolean().optional().default(false),
    isDisliked: z.boolean().optional().default(false),
    likes: z.array(objectIdValid).optional().default([]),
    dislikes: z.array(objectIdValid).optional().default([]),

    image: z
      .string()
      .url()
      .optional()
      .default(
        "https://camarasal.com/wp-content/uploads/2020/08/default-image-5-1.jpg"
      ),

    author: z.string().optional(),
    /*  author: z.string().min(2, "Author name must be at least 2 characters long"), */
    /* publishedAt: z.date(), */
    /*  tags: z.array(z.string()).min(1, "At least one tag is required"), */
    /*  comments: z.array(z.object({
        content: z.string().min(5, "Comment content must be at least 5 characters long"),
        author: z.string().min(2, "Author name must be at least 2 characters long"),
        createdAt: z.date(),
    })).min(1, "At least one comment is required") */
  })
  .omit({
    views: true,
  });

export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;

export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;

export type ObjectBlogIdInput = z.infer<typeof objectBlogIdSchema>;
