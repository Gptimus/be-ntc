"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  CallIcon,
  Location01Icon,
  Facebook01Icon,
  NewTwitterIcon,
  Linkedin01Icon,
  InstagramIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useTransition, useState, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ModeToggle } from "../mode-toggle";

type FooterCategory = "about" | "services" | "legal";
type FooterLink =
  | "aboutUs"
  | "careers"
  | "press"
  | "allServices"
  | "pricing"
  | "security"
  | "privacyPolicy"
  | "terms"
  | "compliance";

const footerLinks: Record<FooterCategory, FooterLink[]> = {
  about: ["aboutUs", "careers", "press"],
  services: ["allServices", "pricing", "security"],
  legal: ["privacyPolicy", "terms", "compliance"],
};

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="relative bg-gradient-to-b from-background to-muted/30 border-t border-border/50">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={
                  mounted && theme === "dark"
                    ? "/images/logo-dark.png"
                    : "/images/logo-light.png"
                }
                alt="BE-NTC Logo"
                width={160}
                height={53}
                className="h-12 w-auto mb-6"
              />
              <p className="text-muted-foreground font-light leading-relaxed mb-8 max-w-sm">
                Your all-in-one financial super app for the Democratic Republic
                of Congo.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {[
                  { icon: Facebook01Icon, href: "#", label: "Facebook" },
                  { icon: NewTwitterIcon, href: "#", label: "Twitter" },
                  { icon: Linkedin01Icon, href: "#", label: "LinkedIn" },
                  { icon: InstagramIcon, href: "#", label: "Instagram" },
                ].map(({ icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl flex items-center justify-center hover:bg-card hover:border-border transition-all"
                  >
                    <HugeiconsIcon
                      icon={icon}
                      strokeWidth={1.5}
                      className="w-5 h-5 text-muted-foreground"
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Columns */}
          {(
            Object.entries(footerLinks) as [FooterCategory, FooterLink[]][]
          ).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h4 className="font-medium text-foreground mb-6 text-sm uppercase tracking-wider">
                {t(category)}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground font-light hover:text-primary transition-colors"
                    >
                      {t(link)}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Info */}
        <motion.div
          className="border-t border-border/30 pt-12 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  strokeWidth={1.5}
                  className="w-5 h-5 text-primary"
                />
              </div>
              <div>
                <div className="text-sm text-muted-foreground font-light mb-1">
                  Email
                </div>
                <div className="text-foreground font-light">
                  {t("supportEmail")}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <HugeiconsIcon
                  icon={CallIcon}
                  strokeWidth={1.5}
                  className="w-5 h-5 text-primary"
                />
              </div>
              <div>
                <div className="text-sm text-muted-foreground font-light mb-1">
                  Phone
                </div>
                <div className="text-foreground font-light">{t("phone")}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <HugeiconsIcon
                  icon={Location01Icon}
                  strokeWidth={1.5}
                  className="w-5 h-5 text-primary"
                />
              </div>
              <div>
                <div className="text-sm text-muted-foreground font-light mb-1">
                  Location
                </div>
                <div className="text-foreground font-light">{t("address")}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-light">
          <p>{t("copyright")}</p>
          <div className="flex items-center gap-3">
            <p>{t("madeWithLove")}</p>
            <span className="text-primary">•</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleLanguageChange("en")}
                disabled={isPending}
                className={`px-3 py-1 rounded-lg transition-all ${
                  locale === "en"
                    ? "bg-primary/10 text-primary"
                    : "hover:text-foreground"
                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange("fr")}
                disabled={isPending}
                className={`px-3 py-1 rounded-lg transition-all ${
                  locale === "fr"
                    ? "bg-primary/10 text-primary"
                    : "hover:text-foreground"
                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                FR
              </button>
            </div>
            <span className="text-primary">•</span>
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
