"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDataTransferHorizontalIcon,
  Money03Icon,
  DollarCircleIcon,
} from "@hugeicons/core-free-icons";

export function CurrencyShowcase() {
  const t = useTranslations("currency");
  const tHero = useTranslations("hero");

  return (
    <section
      id="currency"
      className="scroll-mt-20 py-32 md:py-40 bg-gradient-to-b from-muted/30 to-background"
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

        {/* Currency Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* CDF Wallet */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <div className="relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-10 transition-all hover:bg-card hover:border-primary/30 hover:shadow-xl">
              {/* Subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-sm text-muted-foreground font-light mb-2">
                      {t("cdfWallet")}
                    </p>
                    <div className="text-5xl font-light text-foreground currency-cdf tracking-tight">
                      25,000 FC
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <HugeiconsIcon
                      icon={Money03Icon}
                      strokeWidth={1.5}
                      className="w-7 h-7 text-primary"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground font-light">
                    <span>{tHero("available")}</span>
                    <span className="currency-cdf font-medium text-foreground">
                      25,000 FC
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "75%" }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.2,
                        delay: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* USD Wallet */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <div className="relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-10 transition-all hover:bg-card hover:border-accent/30 hover:shadow-xl">
              {/* Subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-sm text-muted-foreground font-light mb-2">
                      {t("usdWallet")}
                    </p>
                    <div className="text-5xl font-light text-foreground currency-usd tracking-tight">
                      $125.50
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <HugeiconsIcon
                      icon={DollarCircleIcon}
                      strokeWidth={1.5}
                      className="w-7 h-7 text-accent"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground font-light">
                    <span>{tHero("available")}</span>
                    <span className="currency-usd font-medium text-foreground">
                      $125.50
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-accent rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "60%" }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.2,
                        delay: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Exchange Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-8 text-center transition-all hover:bg-card hover:border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HugeiconsIcon
                icon={ArrowDataTransferHorizontalIcon}
                strokeWidth={1.5}
                className="w-8 h-8 text-primary"
              />
            </div>
            <h3 className="font-light text-xl text-foreground mb-3">
              {t("exchange")}
            </h3>
            <p className="text-sm text-muted-foreground font-light">
              {t("instantExchange")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
