"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Button } from "@be-ntc/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@be-ntc/ui/components/field";
import { Input } from "@be-ntc/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@be-ntc/ui/components/input-group";

export function ContactForm() {
  const t = useTranslations("contact");

  // Create schema inside component to access translations
  const formSchema = z.object({
    name: z
      .string()
      .min(2, t("validation.nameMin"))
      .max(50, t("validation.nameMax")),
    email: z.string().email(t("validation.emailInvalid")),
    subject: z
      .string()
      .min(5, t("validation.subjectMin"))
      .max(100, t("validation.subjectMax")),
    message: z
      .string()
      .min(20, t("validation.messageMin"))
      .max(500, t("validation.messageMax")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    mode: "all",
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast.success(t("successMessage"), {
      description: t("successDescription"),
      position: "bottom-right",
    });
    form.reset();
  }

  return (
    <section
      id="contact"
      className="scroll-mt-20 py-32 md:py-40 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-12">
            <form
              id="contact-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FieldGroup>
                {/* Name Field */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="contact-form-name">
                        {t("nameLabel")}
                      </FieldLabel>
                      <InputGroup>
                        <Input
                          {...field}
                          id="contact-form-name"
                          aria-invalid={fieldState.invalid}
                          placeholder={t("namePlaceholder")}
                          autoComplete="name"
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Email Field */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="contact-form-email">
                        {t("emailLabel")}
                      </FieldLabel>
                      <InputGroup>
                        <Input
                          {...field}
                          id="contact-form-email"
                          type="email"
                          aria-invalid={fieldState.invalid}
                          placeholder={t("emailPlaceholder")}
                          autoComplete="email"
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Subject Field */}
                <Controller
                  name="subject"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="contact-form-subject">
                        {t("subjectLabel")}
                      </FieldLabel>
                      <InputGroup>
                        <Input
                          {...field}
                          id="contact-form-subject"
                          aria-invalid={fieldState.invalid}
                          placeholder={t("subjectPlaceholder")}
                          autoComplete="off"
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Message Field */}
                <Controller
                  name="message"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="contact-form-message">
                        {t("messageLabel")}
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id="contact-form-message"
                          placeholder={t("messagePlaceholder")}
                          rows={6}
                          className="min-h-32 resize-none"
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.value.length}/500 {t("characters")}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldDescription>
                        {t("messageDescription")}
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="flex-1"
                  disabled={form.formState.isSubmitting}
                >
                  {t("resetButton")}
                </Button>
                <Button
                  type="submit"
                  form="contact-form"
                  className="flex-1"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid
                  }
                >
                  {form.formState.isSubmitting
                    ? t("sendingButton")
                    : t("sendButton")}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
