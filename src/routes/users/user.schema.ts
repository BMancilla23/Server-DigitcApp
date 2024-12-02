import { z } from "zod";

export const createUserSchema = z
  .object({
    firstname: z
      .string()
      .min(2, "First name should be at least 2 characters long."),
    lastname: z
      .string()
      .min(2, "Last name should be at least 2 characters long."),
    email: z
      .string()
      .email("Invalid email address. Please enter a valid email address."),
    mobile: z.string().min(9, "Mobile number should be at least 9 digits long"),
    password: z
      .string()
      .min(8, "Password should be at least 8 characters long"),
  })
  .strict();

export const loginUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email format. Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type LoginUserInput = z.infer<typeof loginUserSchema>;

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
