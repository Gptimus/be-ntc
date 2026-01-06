import { z } from "zod";

export const createEmailInputSchema = (t: (key: string) => string) => {
  return z.object({
    email: z
      .email(t("auth.emailInput.validation.emailInvalid"))
      .toLowerCase()
      .trim(),
  });
};

export type EmailInputFormData = z.infer<
  ReturnType<typeof createEmailInputSchema>
>;
