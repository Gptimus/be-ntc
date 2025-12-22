"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store04Icon,
  Tv02Icon,
  FlashIcon,
  DropletIcon,
  MoneyBag02Icon,
  SecurityCheckIcon,
  BankIcon,
  Globe02Icon,
  Invoice01Icon,
  Atm02Icon,
  DollarCircleIcon,
  Award01Icon,
  CreditCardIcon,
  SmartPhone01Icon,
  Money03Icon,
  MoneyNotFound02Icon,
  HotelIcon,
  DeliveryBox01Icon,
} from "@hugeicons/core-free-icons";

type ServiceKey =
  | "payMerchant"
  | "payTV"
  | "payElectricity"
  | "payWater"
  | "bulkPayment"
  | "assurance"
  | "microfinance"
  | "transferInternational"
  | "payTax"
  | "cashWithdrawal"
  | "currencyExchange"
  | "bet"
  | "cardTransfer"
  | "recharge"
  | "microloan"
  | "transferLocal"
  | "reservation"
  | "foodOrder";

type IconSvgElement = typeof Store04Icon;

const services: Array<{ key: ServiceKey; icon: IconSvgElement }> = [
  { key: "payMerchant", icon: Store04Icon },
  { key: "payTV", icon: Tv02Icon },
  { key: "payElectricity", icon: FlashIcon },
  { key: "payWater", icon: DropletIcon },
  { key: "bulkPayment", icon: MoneyBag02Icon },
  { key: "assurance", icon: SecurityCheckIcon },
  { key: "microfinance", icon: BankIcon },
  { key: "transferInternational", icon: Globe02Icon },
  { key: "payTax", icon: Invoice01Icon },
  { key: "cashWithdrawal", icon: Atm02Icon },
  { key: "currencyExchange", icon: DollarCircleIcon },
  { key: "bet", icon: Award01Icon },
  { key: "cardTransfer", icon: CreditCardIcon },
  { key: "recharge", icon: SmartPhone01Icon },
  { key: "microloan", icon: Money03Icon },
  { key: "transferLocal", icon: MoneyNotFound02Icon },
  { key: "reservation", icon: HotelIcon },
  { key: "foodOrder", icon: DeliveryBox01Icon },
];

export function ServicesGrid() {
  const t = useTranslations("services");

  return (
    <section
      id="services"
      className="py-32 md:py-40 bg-gradient-to-b from-background to-muted/30"
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

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {services.map(({ key, icon }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.02 }}
              className="group"
            >
              <div className="relative h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 transition-colors hover:bg-card hover:border-border">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <HugeiconsIcon
                      icon={icon}
                      strokeWidth={1.5}
                      className="w-7 h-7"
                    />
                  </div>
                  <h3 className="font-light text-sm text-foreground leading-tight">
                    {t(key)}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
