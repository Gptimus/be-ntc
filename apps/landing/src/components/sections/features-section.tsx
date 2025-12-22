"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Wallet03Icon,
  MoneyAdd01Icon,
  MoneyBag01Icon,
  CreditCardValidationIcon,
  Award01Icon,
} from "@hugeicons/core-free-icons";

const features = [
  { key: "wallet", icon: Wallet03Icon },
  { key: "savings", icon: MoneyAdd01Icon },
  { key: "loans", icon: MoneyBag01Icon },
  { key: "payments", icon: CreditCardValidationIcon },
  { key: "rewards", icon: Award01Icon },
];

export function FeaturesSection() {
  const t = useTranslations("features");

  return (
    <section className="py-32 md:py-40 bg-background">
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

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ key, icon }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="relative h-full bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-10 transition-all hover:bg-card hover:border-border hover:shadow-xl">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative">
                  <motion.div
                    className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <HugeiconsIcon
                      icon={icon}
                      strokeWidth={1.5}
                      className="w-8 h-8 text-primary"
                    />
                  </motion.div>

                  <h3 className="text-2xl font-light text-foreground mb-4">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    {t(`${key}.description`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
