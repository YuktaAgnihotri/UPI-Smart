import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(2),
  email: z.string().email("Invaild Email"),
  password: z.string().min(8),
});
export const signInSchema = z.object({
  email : z.string().email("invalid Email"), 
  password: z.string().min(8),
})
export type RegisterInput = z.infer<typeof registerSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
