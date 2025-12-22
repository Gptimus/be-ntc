"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Apple01Icon,
  GoogleIcon,
  Tick02Icon,
  SignalIcon,
  Wifi01Icon,
  BatteryFullIcon,
  ArrowDown01Icon,
  PlusSignIcon,
  ArrowRight01Icon,
  SmartPhone01Icon,
  Globe02Icon,
  Invoice03Icon,
  CreditCardIcon,
  MoneyBag02Icon,
  Wallet02Icon,
  Ticket01Icon,
  Menu01Icon,
  PlayCircle02Icon,
  ShoppingBag02Icon,
  ArrowDownLeft01Icon,
  Home01Icon,
  Search01Icon,
  ScanIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";

export function AppPreview() {
  const t = useTranslations("hero");
  const tApp = useTranslations("appPreview");

  return (
    <section
      id="download"
      className="scroll-mt-20 py-32 md:py-40 bg-gradient-to-b from-muted/30 to-background overflow-hidden"
    >
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
              <motion.div className="relative w-full max-w-[280px]">
                <div className="relative w-full aspect-[9/19]">
                  {/* Phone frame */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-primary/90 dark:from-primary dark:to-primary/90 rounded-[3rem] shadow-2xl p-2.5">
                    {/* Screen */}
                    <div className="relative w-full h-full bg-background rounded-[2.5rem] overflow-hidden flex flex-col">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-primary/80 rounded-b-3xl z-30" />

                      {/* Status Bar */}
                      <div className="flex justify-between items-center px-6 pt-3 pb-1 z-20">
                        <div className="text-[10px] font-medium text-foreground">
                          9:41
                        </div>
                        <div className="flex gap-1.5 text-foreground">
                          <HugeiconsIcon
                            icon={SignalIcon}
                            className="w-3 h-3"
                          />
                          <HugeiconsIcon
                            icon={Wifi01Icon}
                            className="w-3 h-3"
                          />
                          <HugeiconsIcon
                            icon={BatteryFullIcon}
                            className="w-3 h-3"
                          />
                        </div>
                      </div>

                      {/* Scrollable Content */}
                      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative">
                        <div className="relative w-full min-h-full bg-gradient-to-br from-primary/5 to-accent/5 p-5 px-2 pt-4 flex flex-col gap-5">
                          {/* Balance card */}
                          <div className="bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-5 shadow-lg relative overflow-hidden group shrink-0">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl" />
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl" />

                            <div className="relative z-10 flex flex-col gap-6">
                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-primary-foreground/80 text-[10px] font-medium tracking-wide uppercase">
                                    {t("totalBalance")}
                                  </span>
                                  <div className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white font-medium flex items-center gap-1">
                                    <span>USD</span>
                                    <HugeiconsIcon
                                      icon={ArrowDown01Icon}
                                      className="w-2 h-2"
                                    />
                                  </div>
                                </div>
                                <div className="text-3xl font-semibold text-white tracking-tight">
                                  $1,234.56
                                </div>
                              </div>

                              <div className="flex gap-3">
                                <button className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors py-2 rounded-xl text-white text-[10px] font-medium flex items-center justify-center gap-1.5 active:scale-95">
                                  <HugeiconsIcon
                                    icon={PlusSignIcon}
                                    className="w-3 h-3"
                                  />
                                  {t("addMoney")}
                                </button>
                                <button className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors py-2 rounded-xl text-white text-[10px] font-medium flex items-center justify-center gap-1.5 active:scale-95">
                                  <HugeiconsIcon
                                    icon={ArrowRight01Icon}
                                    className="w-3 h-3"
                                  />
                                  {t("transfer")}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Services Grid */}
                          <div>
                            <div className="text-xs font-semibold text-foreground mb-3 px-1">
                              {t("quickActions")}
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                              {[
                                {
                                  icon: SmartPhone01Icon,
                                  label: t("airtime"),
                                  color: "bg-blue-500/10 text-blue-600",
                                },
                                {
                                  icon: Globe02Icon,
                                  label: t("internet"),
                                  color: "bg-purple-500/10 text-purple-600",
                                },
                                {
                                  icon: Invoice03Icon,
                                  label: t("bills"),
                                  color: "bg-orange-500/10 text-orange-600",
                                },
                                {
                                  icon: CreditCardIcon,
                                  label: t("cards"),
                                  color: "bg-pink-500/10 text-pink-600",
                                },
                                {
                                  icon: MoneyBag02Icon,
                                  label: t("savings"),
                                  color: "bg-green-500/10 text-green-600",
                                },
                                {
                                  icon: Wallet02Icon,
                                  label: t("loans"),
                                  color: "bg-indigo-500/10 text-indigo-600",
                                },
                                {
                                  icon: Ticket01Icon,
                                  label: t("events"),
                                  color: "bg-red-500/10 text-red-600",
                                },
                                {
                                  icon: Menu01Icon,
                                  label: t("more"),
                                  color: "bg-gray-500/10 text-gray-600",
                                },
                              ].map((item, i) => (
                                <div
                                  key={i}
                                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                                >
                                  <div
                                    className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center transition-transform group-hover:scale-105`}
                                  >
                                    <HugeiconsIcon
                                      icon={item.icon}
                                      className="w-5 h-5"
                                      strokeWidth={2}
                                    />
                                  </div>
                                  <span className="text-[9px] text-muted-foreground font-medium text-center leading-tight">
                                    {item.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recent Transactions */}
                          <div className="pb-16">
                            <div className="flex justify-between items-center mb-3 px-1">
                              <span className="text-xs font-semibold text-foreground">
                                {t("recentActivity")}
                              </span>
                              <span className="text-[10px] text-primary">
                                {t("seeAll")}
                              </span>
                            </div>
                            <div className="space-y-3">
                              {[
                                {
                                  icon: PlayCircle02Icon,
                                  title: t("netflix"),
                                  date: t("today"),
                                  amount: "-$15.00",
                                  color: "text-red-500 bg-red-500/10",
                                },
                                {
                                  icon: ShoppingBag02Icon,
                                  title: t("grocery"),
                                  date: t("yesterday"),
                                  amount: "-$45.20",
                                  color: "text-orange-500 bg-orange-500/10",
                                },
                                {
                                  icon: ArrowDownLeft01Icon,
                                  title: t("received"),
                                  date: t("date"),
                                  amount: "+$200.00",
                                  color: "text-green-500 bg-green-500/10",
                                },
                              ].map((tx, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3 bg-card/60 backdrop-blur-sm p-2.5 rounded-xl border border-border/40"
                                >
                                  <div
                                    className={`w-9 h-9 rounded-xl ${tx.color} flex items-center justify-center flex-shrink-0`}
                                  >
                                    <HugeiconsIcon
                                      icon={tx.icon}
                                      className="w-4 h-4"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[11px] font-medium text-foreground truncate">
                                      {tx.title}
                                    </div>
                                    <div className="text-[9px] text-muted-foreground">
                                      {tx.date}
                                    </div>
                                  </div>
                                  <div
                                    className={`text-[11px] font-semibold ${
                                      tx.amount.startsWith("+")
                                        ? "text-green-600"
                                        : "text-foreground"
                                    }`}
                                  >
                                    {tx.amount}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Navigation */}
                      <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border/50 px-6 py-3 pb-6 flex justify-between items-center z-20">
                        {[
                          { icon: Home01Icon, active: true },
                          { icon: Search01Icon, active: false },
                          { icon: ScanIcon, active: false, main: true },
                          { icon: CreditCardIcon, active: false },
                          { icon: UserCircleIcon, active: false },
                        ].map((nav, i) =>
                          nav.main ? (
                            <div
                              key={i}
                              className="-mt-8 bg-primary rounded-full p-3 shadow-lg shadow-primary/30 border-4 border-background"
                            >
                              <HugeiconsIcon
                                icon={nav.icon}
                                className="w-5 h-5 text-white"
                              />
                            </div>
                          ) : (
                            <div
                              key={i}
                              className={
                                nav.active
                                  ? "text-primary"
                                  : "text-muted-foreground/50"
                              }
                            >
                              <HugeiconsIcon
                                icon={nav.icon}
                                className="w-5 h-5"
                              />
                            </div>
                          )
                        )}
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
              {tApp("title")}
            </h2>
            <p className="text-xl text-muted-foreground font-light mb-10 leading-relaxed">
              {tApp("subtitle")}
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
              {[tApp("feature1"), tApp("feature2"), tApp("feature3")].map(
                (feature, i) => (
                  <motion.div
                    key={i}
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
                )
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
