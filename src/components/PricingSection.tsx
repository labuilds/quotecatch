"use client"

import { Check, Zap, Globe, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

const tiers = [
  {
    name: "Basic Estimator",
    price: "$0",
    description: "Start capturing homeowner info and giving instant ballparks without lifting a finger.",
    features: [
      "Unlimited lead capture",
      "Manual square-footage estimates",
      "Basic email lead notifications",
      "1 Active Pricing Engine",
      "Standard Dashboard access",
      "Powered by QuoteCatch badge"
    ],
    buttonText: "Current Plan",
    buttonVariant: "outline" as const,
    highlight: false,
    icon: Globe,
    iconColor: "text-slate-400",
    bgColor: "bg-white",
  },
  {
    name: "Pro Satellite",
    price: "$49",
    period: "/mo",
    description: "Stop climbing roofs for free. Measure homes from your truck and automate your sales.",
    features: [
      "Unlimited leads & calculators",
      "Instant satellite roof measurements",
      "Zapier & Webhook integrations",
      "Analytics & Conversion insights",
      "Remove 'Powered by' branding"
    ],
    buttonText: "Upgrade to Pro Satellite",
    buttonVariant: "default" as const,
    highlight: true,
    icon: Zap,
    iconColor: "text-red-400",
    bgColor: "bg-[#0F172A]",
  }
]

interface PricingSectionProps {
  onUpgrade?: () => void;
  showButton?: boolean;
}

export function PricingSection({ onUpgrade, showButton = true }: PricingSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {tiers.map((tier, i) => (
        <motion.div
          key={tier.name}
          initial={{ opacity: 1, y: 0 }}
          className={`relative rounded-[2.5rem] lg:rounded-[3rem] p-6 lg:p-10 flex flex-col h-full border ${tier.highlight
            ? "border-red-500/20 shadow-xl lg:shadow-[0_40px_80px_rgba(185,28,28,0.15)] ring-1 ring-red-500/30"
            : "border-slate-100 bg-white shadow-sm"
            } ${tier.bgColor}`}
        >
          {tier.highlight && (
            <div className="absolute -top-3.5 lg:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-700 to-red-500 text-white text-[11px] lg:text-[13px] font-black uppercase tracking-[0.2em] px-4 lg:px-5 py-1 lg:py-1.5 rounded-full shadow-lg">
              Most Popular
            </div>
          )}

          <div className="mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${tier.highlight ? "bg-white/10" : "bg-slate-50 border border-slate-100"}`}>
              <tier.icon className={`w-7 h-7 ${tier.iconColor}`} />
            </div>
            <h3 className={`text-[24px] font-black tracking-tight mb-2 ${tier.highlight ? "text-white" : "text-slate-900"}`}>
              {tier.name}
            </h3>
            <p className={`text-[15px] font-medium leading-relaxed ${tier.highlight ? "text-slate-400" : "text-slate-500"}`}>
              {tier.description}
            </p>
          </div>

          <div className="mb-10 flex items-baseline gap-1">
            <span className={`text-[48px] font-black tracking-tighter ${tier.highlight ? "text-white" : "text-slate-900"}`}>
              {tier.price}
            </span>
            {tier.period && (
              <span className={`text-[18px] font-bold ${tier.highlight ? "text-slate-300" : "text-slate-400"}`}>
                {tier.period}
              </span>
            )}
          </div>

          <div className="space-y-4 mb-12 flex-1">
            {tier.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${tier.highlight ? "bg-red-500/20" : "bg-emerald-50"}`}>
                  <Check className={`w-3 h-3 ${tier.highlight ? "text-red-400" : "text-emerald-500"}`} />
                </div>
                <span className={`text-[15px] font-bold ${tier.highlight ? "text-slate-200" : "text-slate-600"}`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {showButton && (
            <Link 
              href={tier.highlight && !onUpgrade ? "/login?intent=pro" : "#"} 
              className="contents"
              onClick={(e) => {
                if (onUpgrade) {
                  e.preventDefault()
                  onUpgrade()
                } else if (!tier.highlight) {
                  e.preventDefault()
                }
              }}
            >
              <Button
                variant={tier.buttonVariant}
                className={`w-full h-16 rounded-2xl font-black text-[16px] transition-all hover:scale-[1.02] active:scale-[0.98] ${tier.highlight
                  ? "bg-white text-[#0F172A] hover:bg-slate-50 border-none shadow-xl shadow-white/5"
                  : "border-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
              >
                {tier.buttonText}
                {tier.highlight && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </Link>
          )}
        </motion.div>
      ))}
    </div>
  );
}
