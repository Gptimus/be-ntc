"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@be-ntc/ui/components/carousel";

const testimonials = ["testimonial1", "testimonial2", "testimonial3"];

export function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section
      id="testimonials"
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

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((key) => (
                <CarouselItem key={key}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-12 md:p-16"
                  >
                    {/* Stars */}
                    <div className="flex gap-1.5 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <HugeiconsIcon
                          icon={StarIcon}
                          key={i}
                          strokeWidth={0}
                          className="w-5 h-5 fill-primary text-primary"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-2xl md:text-3xl text-foreground mb-10 leading-relaxed font-light">
                      "{t(`${key}.content`)}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xl font-light text-primary">
                          {t(`${key}.name`).charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-lg">
                          {t(`${key}.name`)}
                        </div>
                        <div className="text-sm text-muted-foreground font-light">
                          {t(`${key}.role`)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
