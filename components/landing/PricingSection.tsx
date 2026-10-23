"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Minus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { LANDING_CONFIG } from "@/lib/landing-config";

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      id: "hobby",
      name: "Hobby",
      tagline: "For student developers and side projects.",
      price: "Free",
      priceDetail: "No credit card needed",
      includesTitle: "Includes:",
      features: [
        "Up to 3 GitHub repositories",
        "Google XYZ bullet generator",
        "Single-page clean ATS PDF",
        "Community Discord support",
      ],
      ctaLabel: "Start for free",
      ctaHref: "/login",
      isPrimary: false,
    },
    {
      id: "pro",
      name: "Pro",
      badge: "Save 20%",
      tagline: "For developers actively applying to top tech roles.",
      price: billingPeriod === "yearly" ? "$15" : "$19",
      priceDetail: "per month, billed yearly",
      includesTitle: "Everything in Hobby, plus:",
      features: [
        "Unlimited GitHub repositories",
        "5 role-tailored versions",
        "ATS score parser (Greenhouse/Lever)",
        "Keyword gap analyzer",
      ],
      ctaLabel: "Start a 14-day trial",
      ctaHref: "/login",
      isPrimary: false,
    },
    {
      id: "lifetime",
      name: "Lifetime",
      badge: "Best Value",
      tagline: "One-time investment for your entire career.",
      price: "$49",
      priceDetail: "one-time payment, forever updates",
      includesTitle: "Everything in Pro, plus:",
      features: [
        "All future templates & features",
        "GitHub Webhook auto-sync on push",
        "Custom portfolio CV link",
        "Priority ATS score reviewer",
      ],
      ctaLabel: "Get lifetime access",
      ctaHref: "/login",
      isPrimary: true, // White standout button matching reference!
    },
    {
      id: "enterprise",
      name: "Campus",
      tagline: "For university bootcamps, clubs, and hiring teams.",
      price: "Custom",
      priceDetail: "Volume pricing for student batches",
      includesTitle: "Everything in Lifetime, plus:",
      features: [
        "Cohort dashboard & bulk seats",
        "Batch ATS analysis report",
        "Custom resume templates",
        "Dedicated onboarding session",
      ],
      ctaLabel: "Talk to sales",
      ctaHref: "mailto:sales@resummit.app",
      isPrimary: false,
    },
  ];

  const comparisonCategories = [
    {
      name: "Usage",
      rows: [
        { feature: "Repositories tracked", hobby: "3", pro: "Unlimited", lifetime: "Unlimited", enterprise: "Unlimited" },
        { feature: "Tailored role versions", hobby: "1", pro: "5", lifetime: "Unlimited", enterprise: "Unlimited" },
        { feature: "Auto-sync on git push", hobby: false, pro: true, lifetime: true, enterprise: true },
        { feature: "Export formats", hobby: "PDF", pro: "PDF + TXT", lifetime: "PDF + TXT + MD", enterprise: "All + API" },
      ],
    },
    {
      name: "Intelligence & ATS",
      rows: [
        { feature: "Google XYZ formula rewrite", hobby: true, pro: true, lifetime: true, enterprise: true },
        { feature: "Greenhouse / Lever ATS test", hobby: false, pro: true, lifetime: true, enterprise: true },
        { feature: "Missing keywords gap audit", hobby: false, pro: true, lifetime: true, enterprise: true },
        { feature: "Custom prompt tuning", hobby: false, pro: false, lifetime: true, enterprise: true },
      ],
    },
    {
      name: "Support & Security",
      rows: [
        { feature: "Strict read-only Git privacy", hobby: true, pro: true, lifetime: true, enterprise: true },
        { feature: "Custom portfolio URL", hobby: false, pro: false, lifetime: true, enterprise: true },
        { feature: "Team dashboard & batch license", hobby: false, pro: false, lifetime: false, enterprise: true },
      ],
    },
  ];

  return (
    <section id="pricing" className="scroll-mt-12 bg-[#09090b] text-white py-24 sm:py-32 border-t border-neutral-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Top Billing Toggle (Pill style matching reference with animated sliding pill) */}
        <div className="flex justify-center">
          <div className="relative inline-flex items-center rounded-full border border-[#27272a] bg-[#141417] p-1 shadow-inner">
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              className={`relative z-10 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                billingPeriod === "monthly" ? "text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {billingPeriod === "monthly" && (
                <motion.div
                  layoutId="billing-pill"
                  className="absolute inset-0 rounded-full bg-neutral-800 shadow-sm"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">Monthly</span>
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod("yearly")}
              className={`relative z-10 rounded-full px-4 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${
                billingPeriod === "yearly" ? "text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {billingPeriod === "yearly" && (
                <motion.div
                  layoutId="billing-pill"
                  className="absolute inset-0 rounded-full bg-neutral-800 shadow-sm"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">Annual</span>
              <span className="relative z-10 rounded-full bg-sky-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-sky-400">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 4 Elevated Pricing Cards (Exact match to reference) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border border-neutral-800/80 bg-[#111114] p-6 flex flex-col justify-between shadow-xl relative hover:border-neutral-700 transition-colors"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">{plan.name}</h3>
                  {plan.badge && (
                    <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-medium text-sky-400">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-neutral-400 min-h-[32px]">{plan.tagline}</p>

                {/* Price Display */}
                <div className="mt-6">
                  <div className="text-3xl font-bold tracking-tight text-white font-mono">
                    {plan.price}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">{plan.priceDetail}</div>
                </div>

                {/* Feature List */}
                <div className="mt-8 space-y-3">
                  <div className="text-xs font-medium text-neutral-400">{plan.includesTitle}</div>
                  <ul className="space-y-2.5 text-xs text-neutral-300">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="h-3.5 w-3.5 shrink-0 text-neutral-400 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8 pt-4">
                <Link
                  href={plan.ctaHref}
                  className={`inline-flex w-full items-center justify-center rounded-full py-2.5 text-xs font-semibold transition-all ${
                    plan.isPrimary
                      ? "bg-white text-neutral-950 hover:bg-neutral-200 shadow-md"
                      : "border border-neutral-700/80 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table (Exact match to reference bottom table) */}
        <div className="mt-20 pt-12 border-t border-neutral-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400">
                  <th className="pb-4 font-semibold text-sm text-white w-2/5">Features</th>
                  <th className="pb-4 font-semibold w-[15%]">Hobby</th>
                  <th className="pb-4 font-semibold w-[15%]">Pro</th>
                  <th className="pb-4 font-semibold w-[15%] text-sky-400">Lifetime</th>
                  <th className="pb-4 font-semibold w-[15%]">Campus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {comparisonCategories.map((category) => (
                  <React.Fragment key={category.name}>
                    <tr>
                      <td
                        colSpan={5}
                        className="pt-6 pb-2 font-mono text-[11px] font-semibold text-sky-400 uppercase tracking-wider"
                      >
                        {category.name}
                      </td>
                    </tr>
                    {category.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-neutral-900/40">
                        <td className="py-3 text-neutral-300 font-medium">{row.feature}</td>
                        <td className="py-3 text-neutral-400">
                          {typeof row.hobby === "boolean" ? (
                            row.hobby ? (
                              <Check className="h-4 w-4 text-sky-400" />
                            ) : (
                              <Minus className="h-4 w-4 text-neutral-600" />
                            )
                          ) : (
                            row.hobby
                          )}
                        </td>
                        <td className="py-3 text-neutral-400">
                          {typeof row.pro === "boolean" ? (
                            row.pro ? (
                              <Check className="h-4 w-4 text-sky-400" />
                            ) : (
                              <Minus className="h-4 w-4 text-neutral-600" />
                            )
                          ) : (
                            row.pro
                          )}
                        </td>
                        <td className="py-3 text-white font-medium">
                          {typeof row.lifetime === "boolean" ? (
                            row.lifetime ? (
                              <Check className="h-4 w-4 text-sky-400" />
                            ) : (
                              <Minus className="h-4 w-4 text-neutral-600" />
                            )
                          ) : (
                            row.lifetime
                          )}
                        </td>
                        <td className="py-3 text-neutral-400">
                          {typeof row.enterprise === "boolean" ? (
                            row.enterprise ? (
                              <Check className="h-4 w-4 text-sky-400" />
                            ) : (
                              <Minus className="h-4 w-4 text-neutral-600" />
                            )
                          ) : (
                            row.enterprise
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
