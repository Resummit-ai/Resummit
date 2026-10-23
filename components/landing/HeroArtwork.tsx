"use client";

import React, { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  progress: number;
  speed: number;
  radius: number;
  alpha: number;
  pathIndex: number;
  scatterX: number;
  scatterY: number;
};

export default function HeroArtwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Flow path bezier definitions relative to width & height
    const getFlowPaths = (w: number, h: number) => {
      const startX = 0;
      const startY = h * 0.48;
      const endX = w;
      const endY = h * 0.44;

      return [
        {
          start: { x: startX, y: startY - 12 },
          cp1: { x: w * 0.28, y: h * 0.18 },
          cp2: { x: w * 0.68, y: h * 0.24 },
          end: { x: endX, y: endY - 15 },
        },
        {
          start: { x: startX, y: startY },
          cp1: { x: w * 0.32, y: h * 0.46 },
          cp2: { x: w * 0.62, y: h * 0.44 },
          end: { x: endX, y: endY },
        },
        {
          start: { x: startX, y: startY + 16 },
          cp1: { x: w * 0.25, y: h * 0.72 },
          cp2: { x: w * 0.7, y: h * 0.66 },
          end: { x: endX, y: endY + 18 },
        },
        {
          start: { x: startX, y: startY + 6 },
          cp1: { x: w * 0.4, y: h * 0.32 },
          cp2: { x: w * 0.75, y: h * 0.5 },
          end: { x: endX, y: endY + 2 },
        },
      ];
    };

    const getBezierPoint = (
      p0: { x: number; y: number },
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      p3: { x: number; y: number },
      t: number
    ) => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
      const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;
      return { x, y };
    };

    // Initialize particles
    const PARTICLE_COUNT = 65;
    const particles: Particle[] = [];
    const colors = ["#245DFF", "#4F8CFF", "#60A5FA", "#93C5FD", "#3B82F6"];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        baseX: 0,
        baseY: 0,
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
        radius: 1.2 + Math.random() * 2.2,
        alpha: 0.4 + Math.random() * 0.55,
        pathIndex: Math.floor(Math.random() * 4),
        scatterX: 0,
        scatterY: 0,
      });
    }

    // Pointer move listener relative to canvas
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const onPointerLeave = () => {
      mouseRef.current.active = false;
    };

    const target = container;
    target.addEventListener("pointermove", onPointerMove, { passive: true });
    target.addEventListener("pointerleave", onPointerLeave);

    // Animation Loop
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const paths = getFlowPaths(width, height);
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.scatterX = 0;
          p.scatterY = 0;
          p.pathIndex = Math.floor(Math.random() * paths.length);
        }

        const path = paths[p.pathIndex] || paths[0];
        const pt = getBezierPoint(path.start, path.cp1, path.cp2, path.end, p.progress);

        p.baseX = pt.x;
        p.baseY = pt.y;

        // Pointer proximity interaction
        if (mouse.active) {
          const dx = p.baseX + p.scatterX - mouse.x;
          const dy = p.baseY + p.scatterY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 95;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 32;
            const angle = Math.atan2(dy, dx);
            p.scatterX += Math.cos(angle) * force * 0.2;
            p.scatterY += Math.sin(angle) * force * 0.2;
          }
        }

        // Smoothly settle scatter back to zero
        p.scatterX *= 0.92;
        p.scatterY *= 0.92;

        p.x = p.baseX + p.scatterX;
        p.y = p.baseY + p.scatterY;

        // Draw particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors[i % colors.length];
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = "#245DFF";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      target.removeEventListener("pointermove", onPointerMove);
      target.removeEventListener("pointerleave", onPointerLeave);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-artwork-stage"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "330px",
        height: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "0 auto 16px auto",
        userSelect: "none",
        overflow: "visible",
      }}
    >
      {/* 1. Oversized Faint Background Typography: CAREER */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "42%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "clamp(4.5rem, 13vw, 10rem)",
          fontWeight: 900,
          fontFamily: "Inter, system-ui, sans-serif",
          letterSpacing: "0.1em",
          color: "rgba(36, 93, 255, 0.035)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        CAREER
      </div>

      {/* 2. Left Side: Code Editor Visual */}
      <div
        className="hero-code-editor"
        style={{
          position: "relative",
          zIndex: 3,
          width: "min(330px, 30vw)",
          minWidth: "260px",
          background: "#12151B",
          borderRadius: "14px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow:
            "0 20px 40px -10px rgba(16, 35, 74, 0.24), 0 8px 16px -6px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Editor Chrome Bar */}
        <div
          style={{
            height: "36px",
            background: "#181C24",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            justifyContent: "space-between",
          }}
        >
          {/* Window control dots */}
          <div style={{ display: "flex", gap: "6px" }}>
            <span
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#EF4444",
                opacity: 0.85,
              }}
            />
            <span
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#F59E0B",
                opacity: 0.85,
              }}
            />
            <span
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#10B981",
                opacity: 0.85,
              }}
            />
          </div>

          {/* Active Tab */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#12151B",
              padding: "4px 10px",
              borderRadius: "6px 6px 0 0",
              borderTop: "2px solid #245DFF",
              fontSize: "11px",
              color: "#E2E8F0",
              fontFamily: "monospace",
            }}
          >
            <span style={{ color: "#60A5FA" }}>⚡</span>
            calibrator.ts
          </div>

          <div style={{ width: "28px" }} />
        </div>

        {/* Floating Dark GitHub Pill Badge */}
        <div
          style={{
            position: "absolute",
            top: "28px",
            right: "-20px",
            zIndex: 10,
            background: "rgba(18, 21, 27, 0.94)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "10px",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.4)",
            maxWidth: "200px",
          }}
        >
          <svg
            height="18"
            viewBox="0 0 16 16"
            width="18"
            fill="#FFFFFF"
            style={{ flexShrink: 0 }}
          >
            <path d="M8 0c4.42 0 8 3.58 8 8a8.01 8.01 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
          </svg>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#FFFFFF" }}>
              GitHub
            </div>
            <div
              style={{
                fontSize: "9px",
                color: "#94A3B8",
                lineHeight: "1.2",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Analyze repo & commits
            </div>
          </div>
        </div>

        {/* Code Editor Body */}
        <div
          style={{
            display: "flex",
            padding: "12px 10px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "11px",
            lineHeight: "1.65",
            color: "#CBD5E1",
          }}
        >
          {/* Mini Sidebar file list */}
          <div
            style={{
              width: "74px",
              borderRight: "1px solid rgba(255, 255, 255, 0.05)",
              paddingRight: "8px",
              marginRight: "8px",
              fontSize: "9.5px",
              color: "#64748B",
            }}
          >
            <div style={{ color: "#94A3B8", marginBottom: "4px" }}>▸ src</div>
            <div style={{ paddingLeft: "8px", color: "#60A5FA" }}>• app.ts</div>
            <div style={{ paddingLeft: "8px" }}>• sync.ts</div>
            <div style={{ paddingLeft: "8px" }}>• parse.ts</div>
            <div style={{ marginTop: "6px" }}>package.json</div>
          </div>

          {/* Code Area */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div>
              <span style={{ color: "#F43F5E" }}>import </span>
              <span style={{ color: "#38BDF8" }}>{"{ scan }"} </span>
              <span style={{ color: "#F43F5E" }}>from </span>
              <span style={{ color: "#FBBF24" }}>&quot;@github/core&quot;</span>;
            </div>
            <div style={{ height: "4px" }} />
            <div>
              <span style={{ color: "#A855F7" }}>const </span>
              <span style={{ color: "#38BDF8" }}>profile </span>
              <span style={{ color: "#A855F7" }}>= </span>
              <span style={{ color: "#F43F5E" }}>await </span>
              <span style={{ color: "#38BDF8" }}>scan</span>();
            </div>
            <div>
              <span style={{ color: "#64748B" }}>// Extracting skills</span>
            </div>
            <div>
              <span style={{ color: "#38BDF8" }}>profile</span>.
              <span style={{ color: "#10B981" }}>detectStack</span>();
            </div>
            <div>
              <span style={{ color: "#38BDF8" }}>profile</span>.
              <span style={{ color: "#10B981" }}>generateBullets</span>();
            </div>
            <div>
              <span style={{ color: "#A855F7" }}>return </span>
              <span style={{ color: "#38BDF8" }}>exportToATS</span>();
            </div>
          </div>
        </div>

        {/* Emitters from code editor right border */}
        <div
          style={{
            position: "absolute",
            right: "0",
            top: "48%",
            width: "6px",
            height: "12px",
            background: "#245DFF",
            borderRadius: "4px 0 0 4px",
            boxShadow: "0 0 12px #245DFF",
          }}
        />
      </div>

      {/* 3. Center: Dynamic Flow Layer (SVG Lines, Tech Pills, Mini Preview Cards & Canvas) */}
      <div
        className="hero-flow-zone"
        style={{
          position: "relative",
          flex: 1,
          height: "360px",
          margin: "0 10px",
          zIndex: 2,
        }}
      >
        {/* Interactive Particle Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 4,
          }}
        />

        {/* SVG Curved Connection Flow Lines */}
        <svg
          viewBox="0 0 400 300"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <defs>
            <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#245DFF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#4F8CFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#245DFF" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="flowGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#245DFF" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Main Flow Lines */}
          <path
            d="M 0 145 C 80 145, 120 70, 240 70 C 310 70, 350 135, 400 135"
            fill="none"
            stroke="url(#flowGrad1)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 0 145 C 100 145, 180 140, 260 140 C 330 140, 360 140, 400 140"
            fill="none"
            stroke="url(#flowGrad1)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 0 145 C 70 145, 110 225, 230 225 C 310 225, 350 145, 400 145"
            fill="none"
            stroke="url(#flowGrad2)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Node Rings */}
          <circle cx="120" cy="145" r="8" fill="#FFFFFF" stroke="#245DFF" strokeWidth="2.5" />
          <circle cx="120" cy="145" r="3.5" fill="#245DFF" />
          <circle cx="210" cy="70" r="4" fill="#245DFF" />
          <circle cx="210" cy="225" r="4" fill="#60A5FA" />
          <circle cx="360" cy="140" r="6" fill="#FFFFFF" stroke="#245DFF" strokeWidth="2" />
        </svg>

        {/* Floating Technology Pills */}
        <div
          style={{
            position: "absolute",
            top: "14%",
            left: "48%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "8px",
            zIndex: 5,
          }}
        >
          {/* React Pill */}
          <div
            style={{
              background: "#E8EEFF",
              border: "1px solid #CFD9FF",
              borderRadius: "100px",
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#1E40AF",
              boxShadow: "0 4px 12px rgba(36, 93, 255, 0.1)",
            }}
          >
            <span style={{ color: "#0284C7" }}>⚛</span> React
          </div>

          {/* Python Pill */}
          <div
            style={{
              background: "#E8EEFF",
              border: "1px solid #CFD9FF",
              borderRadius: "100px",
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#1E40AF",
              boxShadow: "0 4px 12px rgba(36, 93, 255, 0.1)",
            }}
          >
            <span style={{ color: "#EAB308" }}>🐍</span> Python
          </div>

          {/* API Design Pill */}
          <div
            style={{
              background: "#E8EEFF",
              border: "1px solid #CFD9FF",
              borderRadius: "100px",
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#1E40AF",
              boxShadow: "0 4px 12px rgba(36, 93, 255, 0.1)",
            }}
          >
            API Design
          </div>
        </div>

        {/* Floating Preview Card 1: React card preview */}
        <div
          style={{
            position: "absolute",
            top: "32%",
            left: "52%",
            width: "110px",
            background: "#181C24",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            padding: "6px 8px",
            boxShadow: "0 10px 24px rgba(0, 0, 0, 0.18)",
            zIndex: 5,
          }}
        >
          <div style={{ height: "4px", width: "40%", background: "#60A5FA", borderRadius: "2px", marginBottom: "4px" }} />
          <div style={{ height: "3px", width: "80%", background: "rgba(255,255,255,0.2)", borderRadius: "2px", marginBottom: "3px" }} />
          <div style={{ height: "3px", width: "60%", background: "rgba(255,255,255,0.15)", borderRadius: "2px", marginBottom: "6px" }} />
          <div style={{ fontSize: "8.5px", color: "#94A3B8", fontWeight: 600 }}>React card preview</div>
        </div>

        {/* Floating Preview Card 2: Project card preview */}
        <div
          style={{
            position: "absolute",
            bottom: "12%",
            left: "64%",
            width: "120px",
            background: "#181C24",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            padding: "6px 8px",
            boxShadow: "0 10px 24px rgba(0, 0, 0, 0.18)",
            zIndex: 5,
          }}
        >
          <div style={{ height: "4px", width: "50%", background: "#10B981", borderRadius: "2px", marginBottom: "4px" }} />
          <div style={{ height: "3px", width: "85%", background: "rgba(255,255,255,0.2)", borderRadius: "2px", marginBottom: "3px" }} />
          <div style={{ height: "3px", width: "65%", background: "rgba(255,255,255,0.15)", borderRadius: "2px", marginBottom: "6px" }} />
          <div style={{ fontSize: "8.5px", color: "#94A3B8", fontWeight: 600 }}>Project card preview</div>
        </div>
      </div>

      {/* 4. Right Side: Stacked Paper Resume Preview Document */}
      <div
        className="hero-resume-card"
        style={{
          position: "relative",
          zIndex: 3,
          width: "min(270px, 24vw)",
          minWidth: "230px",
          background: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #E2E5EB",
          padding: "14px 14px",
          color: "#151A24",
          boxShadow:
            "0 16px 36px -8px rgba(16, 35, 74, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)",
          flexShrink: 0,
        }}
      >
        {/* Physical Stacked Paper Effect below card */}
        <div
          style={{
            position: "absolute",
            bottom: "-6px",
            left: "8px",
            right: "8px",
            height: "8px",
            background: "#F8FAFC",
            border: "1px solid #E2E5EB",
            borderRadius: "0 0 12px 12px",
            zIndex: -1,
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-11px",
            left: "16px",
            right: "16px",
            height: "8px",
            background: "#F1F5F9",
            border: "1px solid #E2E5EB",
            borderRadius: "0 0 10px 10px",
            zIndex: -2,
          }}
        />

        {/* Resume Header */}
        <div style={{ marginBottom: "8px", borderBottom: "1px solid #F1F5F9", paddingBottom: "6px" }}>
          <div style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.02em", color: "#0F172A" }}>
            Resume
          </div>
          <div style={{ fontSize: "8.5px", color: "#64748B", marginTop: "1px" }}>
            AI resume platform to accelerate career growth
          </div>
        </div>

        {/* Experience Section */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{ fontSize: "9.5px", fontWeight: 800, color: "#1E293B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>
            Experience
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8.5px", fontWeight: 700, color: "#334155" }}>
            <span>• Developer Experience</span>
            <span style={{ color: "#94A3B8", fontWeight: 500 }}>2023 – Present</span>
          </div>
          <div style={{ fontSize: "7.5px", color: "#64748B", paddingLeft: "6px", margin: "1px 0 4px" }}>
            - Architected modular design system & microservices
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8.5px", fontWeight: 700, color: "#334155" }}>
            <span>• Production Scale Project</span>
            <span style={{ color: "#94A3B8", fontWeight: 500 }}>2021 – 2023</span>
          </div>
          <div style={{ fontSize: "7.5px", color: "#64748B", paddingLeft: "6px", marginTop: "1px" }}>
            - Delivered recruiter-ready resume intelligence
          </div>
        </div>

        {/* Projects Section */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{ fontSize: "9.5px", fontWeight: 800, color: "#1E293B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>
            Projects
          </div>
          <div style={{ fontSize: "8.5px", color: "#334155", fontWeight: 600 }}>
            • Distributed Pipeline & Real-Time Sync
          </div>
          <div style={{ fontSize: "7.5px", color: "#64748B", paddingLeft: "6px" }}>
            - Reduced ATS parsing friction by 74%
          </div>
        </div>

        {/* Career / Impact Sparkline Graph */}
        <div style={{ background: "#F8FAFC", borderRadius: "8px", padding: "6px 8px", border: "1px solid #F1F5F9" }}>
          <div style={{ fontSize: "8.5px", fontWeight: 700, color: "#475569", marginBottom: "2px" }}>
            Career / Impact
          </div>
          <svg viewBox="0 0 160 36" style={{ width: "100%", height: "26px", overflow: "visible" }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#245DFF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#245DFF" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 28 Q 35 26, 65 20 T 115 12 T 160 4 L 160 36 L 0 36 Z"
              fill="url(#chartGrad)"
            />
            <path
              d="M 0 28 Q 35 26, 65 20 T 115 12 T 160 4"
              fill="none"
              stroke="#245DFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "7px", color: "#94A3B8", marginTop: "1px" }}>
            <span>2019</span>
            <span>2021</span>
            <span>2023</span>
            <span>2024</span>
          </div>
        </div>
      </div>
    </div>
  );
}
