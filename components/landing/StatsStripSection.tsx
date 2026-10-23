"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileCheck, Globe, Sparkles, KeyRound } from "lucide-react";
import { motion } from "framer-motion";

export function StatsStripSection() {
  const [countersActive, setCountersActive] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !countersActive) {
        setCountersActive(true);
        let c1 = 0;
        const t1 = setInterval(() => {
          c1 += 2;
          setCount1(c1);
          if (c1 >= 50) clearInterval(t1);
        }, 40);
        let c2 = 0;
        const t2 = setInterval(() => {
          c2 += 1;
          setCount2(c2);
          if (c2 >= 10) clearInterval(t2);
        }, 80);
        let c3 = 0;
        const t3 = setInterval(() => {
          c3 += 3;
          setCount3(c3);
          if (c3 >= 60) clearInterval(t3);
        }, 33);
      }
    }, { threshold: 0.2 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, [countersActive]);

  const stats = [
    {
      number: `${count1}+`,
      icon: <FileCheck className="w-5 h-5 text-[#f2efe9]/70" />,
      title: "Resumes Generated",
      desc: "Crafted by developers to secure interviews at top tech companies.",
    },
    {
      number: `${count2}+`,
      icon: <Globe className="w-5 h-5 text-[#f2efe9]/70" />,
      title: "Countries Reached",
      desc: "Helping engineers build global careers across multiple continents.",
    },
    {
      number: `<${count3}s`,
      icon: <Sparkles className="w-5 h-5 text-[#f2efe9]/70" />,
      title: "Generation Time",
      desc: "Instantly parsed from public repository commit histories.",
    },
    {
      number: "100%",
      icon: <KeyRound className="w-5 h-5 text-[#f2efe9]/70" />,
      title: "Free to Start",
      desc: "Sign up today and sync your GitHub without any credit card.",
    },
  ];

  return (
    <section ref={statsRef} className="py-16 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="rounded-2xl border border-[#27272a] bg-[#141417] p-6 flex flex-col justify-between hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl sm:text-4xl font-medium text-[#f2efe9] tracking-tight font-mono">
                {s.number}
              </span>
              <div className="p-2.5 rounded-xl bg-[#1c1c20] border border-[#27272a]">
                {s.icon}
              </div>
            </div>
            <div>
              <h3 className="text-base font-medium text-[#f2efe9] mb-1">{s.title}</h3>
              <p className="text-xs text-[#f2efe9]/60 leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
