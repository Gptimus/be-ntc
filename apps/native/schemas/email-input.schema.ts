import { z } from "zod";

export const createEmailInputSchema = (t: (key: string) => string) => {
  return z.object({
    email: z
      .string()
      .min(1, t("auth.emailInput.validation.emailRequired"))
      .email(t("auth.emailInput.validation.emailInvalid"))
      .toLowerCase()
      .trim(),
  });
};

// Default version for simple imports
export const emailInputSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
});

export type EmailInputFormData = z.infer<
  ReturnType<typeof createEmailInputSchema>
>;
