"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LANDING_CONFIG } from "@/lib/landing-config";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [comparisonOpen, setComparisonOpen] = useState(false);

  return (
    <section id="pricing" className="bg-[rgb(10,10,10)] text-[rgb(242,239,233)] py-24 sm:py-32 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
            Simple Pricing
          </p>
          <h2 className="mt-3 text-4xl font-medium tracking-tight text-balance sm:text-5xl text-[rgb(242,239,233)]">
            Predictable plans for every stage
          </h2>
          <p className="mt-4 text-base text-[rgba(242,239,233,0.7)]">
            Start completely free. Upgrade when you are ready to aggressively target multiple roles.
          </p>

          {/* Billing Toggle Switcher */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-[rgb(242,239,233)] text-neutral-950 shadow-sm"
                  : "text-[rgba(242,239,233,0.6)] hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod("yearly")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 ${
                billingPeriod === "yearly"
                  ? "bg-[rgb(242,239,233)] text-neutral-950 shadow-sm"
                  : "text-[rgba(242,239,233,0.6)] hover:text-white"
              }`}
            >
              <span>Yearly</span>
              <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                {LANDING_CONFIG.pricing.yearlyDiscountBadge}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {LANDING_CONFIG.pricing.plans.map((plan) => {
            const price = billingPeriod === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-8 flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? "border-blue-500 bg-white/[0.04] shadow-[0_0_30px_rgba(37,99,235,0.15)] ring-1 ring-blue-500"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.03]"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-[11px] font-semibold text-white tracking-wider uppercase">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-semibold text-[rgb(242,239,233)]">{plan.name}</h3>
                  <p className="mt-2 text-xs text-[rgba(242,239,233,0.6)] min-h-[32px]">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-[rgb(242,239,233)]">
                      ${price}
                    </span>
                    <span className="text-xs text-[rgba(242,239,233,0.5)]">
                      / month {billingPeriod === "yearly" && "(billed annually)"}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-8 space-y-3.5 text-xs text-[rgba(242,239,233,0.8)]">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <Link
                    href={plan.ctaHref}
                    className={`inline-flex w-full items-center justify-center rounded-full py-2.5 text-xs font-semibold transition-all ${
                      plan.popular
                        ? "bg-[rgb(242,239,233)] text-neutral-950 hover:bg-[rgb(242,239,233)]/90 shadow-[0_0_15px_rgba(242,239,233,0.2)]"
                        : "bg-white/10 text-[rgb(242,239,233)] hover:bg-white/15 inset-ring inset-ring-white/10"
                    }`}
                  >
                    {plan.ctaLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Collapsible Feature Comparison Table */}
        <div className="mt-14 max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => setComparisonOpen(!comparisonOpen)}
            className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm font-medium text-[rgb(242,239,233)] hover:bg-white/[0.04] transition-colors"
          >
            <span>Compare all features across plans</span>
            {comparisonOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {comparisonOpen && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[rgba(242,239,233,0.6)] font-mono uppercase">
                    <th className="pb-3">Feature</th>
                    <th className="pb-3">Hobby</th>
                    <th className="pb-3 text-blue-400">Pro</th>
                    <th className="pb-3">Campus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {LANDING_CONFIG.pricing.comparison.map((cat, cIdx) => (
                    <React.Fragment key={cIdx}>
                      <tr className="bg-white/[0.02]">
                        <td colSpan={4} className="py-2.5 font-semibold text-blue-300">
                          {cat.category}
                        </td>
                      </tr>
                      {cat.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          <td className="py-3 text-[rgba(242,239,233,0.8)] font-medium">
                            {row.name}
                          </td>
                          <td className="py-3 text-[rgba(242,239,233,0.6)]">
                            {typeof row.free === "boolean" ? (
                              row.free ? (
                                <Check className="h-4 w-4 text-emerald-400" />
                              ) : (
                                "—"
                              )
                            ) : (
                              row.free
                            )}
                          </td>
                          <td className="py-3 text-[rgb(242,239,233)] font-semibold">
                            {typeof row.pro === "boolean" ? (
                              row.pro ? (
                                <Check className="h-4 w-4 text-emerald-400" />
                              ) : (
                                "—"
                              )
                            ) : (
                              row.pro
                            )}
                          </td>
                          <td className="py-3 text-[rgba(242,239,233,0.6)]">
                            {typeof row.campus === "boolean" ? (
                              row.campus ? (
                                <Check className="h-4 w-4 text-emerald-400" />
                              ) : (
                                "—"
                              )
                            ) : (
                              row.campus
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
