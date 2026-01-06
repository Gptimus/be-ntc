import { z } from "zod";

export const emailInputSchema = z.object({
  email: z.email("Please enter a valid email address").toLowerCase().trim(),
});

export type EmailInputFormData = z.infer<typeof emailInputSchema>;
