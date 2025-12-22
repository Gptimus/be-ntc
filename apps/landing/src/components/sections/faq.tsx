"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@be-ntc/ui/components/accordion";

const faqs = ["q1", "q2", "q3", "q4", "q5", "q6"];

export function FAQ() {
  const t = useTranslations("faq");

  return (
    <section id="faq" className="scroll-mt-20 py-32 md:py-40 bg-background">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-4xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-xl text-muted-foreground font-light">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="space-y-4"
          >
            {faqs.map((key, index) => (
              <AccordionItem
                key={key}
                value={`item-${index}`}
                className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden transition-all hover:bg-card hover:border-border data-[state=open]:bg-card data-[state=open]:border-border"
              >
                <AccordionTrigger className="px-8 py-6 text-left font-light text-lg md:text-xl text-foreground hover:no-underline">
                  {t(`${key}.question`)}
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-6 text-muted-foreground font-light leading-relaxed text-base">
                  {t(`${key}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
