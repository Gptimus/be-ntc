"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Apple01Icon,
  GoogleIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

export function AppPreview() {
  const t = useTranslations("appPreview");

  return (
    <section className="py-32 md:py-40 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left - Phone Mockup */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex justify-center">
              <motion.div
                className="relative w-full max-w-[200px]"
                // animate={{
                //   y: [0, -15, 0],
                // }}
                // transition={{
                //   duration: 4,
                //   repeat: Infinity,
                //   ease: "easeInOut",
                // }}
              >
                <div className="relative w-full aspect-[9/16]">
                  {/* Phone frame */}
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground to-foreground/90 rounded-[3rem] shadow-2xl p-2.5">
                    {/* Screen */}
                    <div className="relative w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground rounded-b-3xl z-20" />

                      {/* Screen content */}
                      <div className="relative w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 p-6 pt-10">
                        {/* Balance card */}
                        <div className="bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-5 mb-5">
                          <div className="text-primary-foreground/70 text-xs mb-2">
                            Total Balance
                          </div>
                          <div className="text-3xl font-light text-primary-foreground">
                            $1,234.56
                          </div>
                        </div>

                        {/* Services grid */}
                        <div className="grid grid-cols-4 gap-2.5 mb-5">
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className="aspect-square bg-card/50 backdrop-blur-sm rounded-xl"
                            />
                          ))}
                        </div>

                        {/* Transactions */}
                        <div className="space-y-2">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2.5 bg-card/40 backdrop-blur-sm rounded-xl p-2.5"
                            >
                              <div className="w-8 h-8 bg-primary/20 rounded-lg" />
                              <div className="flex-1">
                                <div className="h-2 w-20 bg-foreground/20 rounded-full mb-1" />
                                <div className="h-1.5 w-14 bg-foreground/10 rounded-full" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 tracking-tight">
              {t("title")}
            </h2>
            <p className="text-xl text-muted-foreground font-light mb-10 leading-relaxed">
              {t("subtitle")}
            </p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="#download"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-medium text-base transition-opacity hover:opacity-90"
              >
                <HugeiconsIcon
                  icon={Apple01Icon}
                  strokeWidth={2}
                  className="w-5 h-5"
                />
                <span>App Store</span>
              </a>

              <a
                href="#download"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-card border border-border text-foreground rounded-2xl font-medium text-base transition-colors hover:bg-muted"
              >
                <HugeiconsIcon
                  icon={GoogleIcon}
                  strokeWidth={2}
                  className="w-5 h-5"
                />
                <span>Google Play</span>
              </a>
            </div>

            {/* Features List */}
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {[
                "18+ Financial Services",
                "Multi-Currency Support",
                "Bank-Level Security",
              ].map((feature, i) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      strokeWidth={2}
                      className="w-4 h-4 text-primary"
                    />
                  </div>
                  <span className="text-foreground font-light text-lg">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
