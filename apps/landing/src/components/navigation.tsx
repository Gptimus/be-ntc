"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@be-ntc/ui/components/button";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useTransition } from "react";
import { api } from "@be-ntc/backend/convex/_generated/api";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { authClient } from "@/lib/auth-client";

export function Navigation() {
  const locale = useLocale();
  const t = useTranslations("navigation");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const mutateSomething = useQuery(api.healthCheck.get);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { isAuthenticated, isLoading } = useConvexAuth();

  console.log("Task created with ID3:", mutateSomething);

  console.log({
    isAuthenticated,
    isLoading,
  });

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  const handlePress = async () => {
    const { data, error } = await authClient.signIn.magicLink({
      email: "guerthmanzala@gmail.com", // required
      name: "Guerth Manzala",
      callbackURL: "/",
      newUserCallbackURL: "/",
      errorCallbackURL: "/",
    });
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-center justify-between h-20">
          <Button onClick={handlePress}>Call</Button>
          {/* Logo */}
          <a href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="BE-NTC Logo"
              width={140}
              height={46}
              className="h-10 w-auto"
              priority
            />
          </a>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href="#services"
              className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("services")}
            </a>
            <a
              href="#currency"
              className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("currency")}
            </a>
            <a
              href="#features"
              className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("features")}
            </a>
            <a
              href="#testimonials"
              className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("testimonials")}
            </a>
            <a
              href="#faq"
              className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("faq")}
            </a>
            <a
              href="#contact"
              className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("contact")}
            </a>
          </div>

          {/* CTA & Language Switcher */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-1">
              <button
                onClick={() => handleLanguageChange("en")}
                disabled={isPending}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  locale === "en"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange("fr")}
                disabled={isPending}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  locale === "fr"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                FR
              </button>
            </div>
            <Button size="sm" asChild>
              <a href="#download">{t("download")}</a>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
