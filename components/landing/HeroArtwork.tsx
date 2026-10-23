"use client";

import React, { useEffect, useRef, useState } from "react";

type Particle = {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  type: "spore" | "leaf" | "dust";
};

export default function HeroArtwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const img = imgRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animId: number;
    let width = (canvas.width = container.offsetWidth);
    let height = (canvas.height = container.offsetHeight);

    // Offscreen mask canvas to check branch silhouette
    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });

    const updateMask = () => {
      if (!img || !maskCtx || !img.complete || img.naturalWidth === 0) return;
      maskCanvas.width = 300;
      maskCanvas.height = 168; // ~16:9 aspect ratio
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      maskCtx.drawImage(img, 0, 0, maskCanvas.width, maskCanvas.height);
    };

    if (img && img.complete) {
      updateMask();
    }

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
      updateMask();
    };
    window.addEventListener("resize", handleResize);

    // Particle Object Pool
    const MAX_PARTICLES = 240;
    const particles: Particle[] = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 3,
        color: "#65A30D",
        alpha: 1,
        decay: 0.015,
        rotation: 0,
        vRot: 0,
        type: "spore",
      });
    }

    const sporeColors = ["#3F6212", "#4D7C0F", "#65A30D", "#84CC16", "#A3E635", "#22C55E"];
    const dustColors = ["#FEF08A", "#FBBF24", "#D9F99D", "#FDE047", "#86EFAC"];
    const leafColors = ["#14532D", "#15803D", "#16A34A", "#22C55E", "#4ADE80", "#166534"];

    // Check if a point (cx, cy) in container coordinates is on or within proximity to the branch
    const isNearBranch = (cx: number, cy: number): boolean => {
      if (!img || !maskCtx || maskCanvas.width === 0) {
        const relY = cy / height;
        return relY > 0.15 && relY < 0.85;
      }

      const imgRect = img.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();

      // Convert container coords to image-relative coords
      const ix = cx - (imgRect.left - contRect.left);
      const iy = cy - (imgRect.top - contRect.top);

      if (ix < -40 || ix > imgRect.width + 40 || iy < -40 || iy > imgRect.height + 40) {
        return false;
      }

      // Map to mask canvas coordinates (300 x 168)
      const mx = Math.floor((ix / imgRect.width) * maskCanvas.width);
      const my = Math.floor((iy / imgRect.height) * maskCanvas.height);

      try {
        // Generous proximity: sample a radius of 6 pixels in mask (~50px on screen)
        const radius = 6;
        const sx = Math.max(0, mx - radius);
        const sy = Math.max(0, my - radius);
        const sw = Math.min(maskCanvas.width - sx, radius * 2 + 1);
        const sh = Math.min(maskCanvas.height - sy, radius * 2 + 1);

        if (sw <= 0 || sh <= 0) return true;

        const imgData = maskCtx.getImageData(sx, sy, sw, sh).data;
        for (let i = 3; i < imgData.length; i += 4) {
          if (imgData[i] > 15) {
            return true; // Near or over non-transparent branch pixel
          }
        }
      } catch {
        return true;
      }

      return false;
    };

    // Emit particles at cursor position with organic velocity
    const spawnParticles = (x: number, y: number, count: number, pvx: number, pvy: number) => {
      if (prefersReducedMotion) return;

      const pSpeed = Math.sqrt(pvx * pvx + pvy * pvy);
      const normX = pSpeed > 0.1 ? -pvy / pSpeed : 0;
      const normY = pSpeed > 0.1 ? pvx / pSpeed : 0;

      let spawned = 0;
      for (let i = 0; i < MAX_PARTICLES; i++) {
        const p = particles[i];
        if (!p.active) {
          p.active = true;
          // Localized organic scatter around pointer
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 28;
          p.x = x + Math.cos(angle) * dist;
          p.y = y + Math.sin(angle) * dist;

          const randType = Math.random();
          if (randType < 0.50) {
            p.type = "spore";
            p.color = sporeColors[Math.floor(Math.random() * sporeColors.length)];
            p.size = 2.4 + Math.random() * 2.8;
            p.decay = 0.010 + Math.random() * 0.014;
          } else if (randType < 0.78) {
            p.type = "dust";
            p.color = dustColors[Math.floor(Math.random() * dustColors.length)];
            p.size = 1.6 + Math.random() * 2.2;
            p.decay = 0.009 + Math.random() * 0.013;
          } else {
            p.type = "leaf";
            p.color = leafColors[Math.floor(Math.random() * leafColors.length)];
            p.size = 3.6 + Math.random() * 4.4;
            p.decay = 0.006 + Math.random() * 0.010;
          }

          // Swirl and drift with mouse impulse
          const swirlFactor = (Math.random() - 0.5) * 2.0;
          p.vx = (Math.random() - 0.5) * 1.6 + normX * swirlFactor + pvx * 0.09;
          p.vy = -0.5 - Math.random() * 1.1 + normY * swirlFactor + pvy * 0.09;
          p.alpha = 0.82 + Math.random() * 0.18;
          p.rotation = Math.random() * Math.PI * 2;
          p.vRot = (Math.random() - 0.5) * 0.14;

          spawned++;
          if (spawned >= count) break;
        }
      }
    };

    let prevPointerX = -9999;
    let prevPointerY = -9999;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let pvx = 0;
      let pvy = 0;
      if (prevPointerX !== -9999) {
        pvx = x - prevPointerX;
        pvy = y - prevPointerY;
      }
      const speed = Math.sqrt(pvx * pvx + pvy * pvy);

      prevPointerX = x;
      prevPointerY = y;

      // Check proximity to the branch
      if (isNearBranch(x, y)) {
        // Emit count proportional to movement speed: 4 to 9 particles per move step
        const count = Math.min(9, Math.max(4, Math.floor(speed / 5) + 2));
        spawnParticles(x, y, count, pvx, pvy);
      }
    };

    const onPointerLeave = () => {
      prevPointerX = -9999;
      prevPointerY = -9999;
    };

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave, { passive: true });

    // Animation loop
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < MAX_PARTICLES; i++) {
        const p = particles[i];
        if (!p.active) continue;

        // Physics: air resistance, gentle settling drift
        p.vx *= 0.955;
        p.vy *= 0.955;
        p.vy += 0.022; // gentle settling drift
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0.01) {
          p.active = false;
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === "leaf") {
          // Delicate organic leaf silhouette
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = "rgba(20, 83, 45, 0.35)";
          ctx.shadowBlur = 3;
          ctx.fill();
        } else if (p.type === "dust") {
          // Soft glowing pollen grain
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fill();
        } else {
          // Velvety moss spore
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = "rgba(77, 124, 15, 0.4)";
          ctx.shadowBlur = 4;
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      observer.disconnect();
    };
  }, [imageLoaded]);

  return (
    <div
      ref={containerRef}
      className="hero-artwork-stage"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "380px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        cursor: "default",
      }}
    >
      {/* 1. Oversized Faint Background Typography: CAREER */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "clamp(6.5rem, 19vw, 17rem)",
          fontWeight: 900,
          fontFamily: "Inter, system-ui, sans-serif",
          letterSpacing: "0.07em",
          color: "rgba(21, 26, 36, 0.038)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        CAREER
      </div>

      {/* 2. Main Centerpiece: Realistic Moss-Covered Looping Branch */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1560px",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 clamp(0px, 2vw, 32px)",
        }}
      >
        <img
          ref={imgRef}
          src="/images/moss_branch.png?v=3"
          alt="Sculptural organic moss-covered branch forming a central loop"
          onLoad={() => setImageLoaded(true)}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "460px",
            objectFit: "contain",
            display: "block",
            pointerEvents: "none",
            filter: "drop-shadow(0 20px 30px rgba(16, 35, 74, 0.07))",
          }}
        />
      </div>

      {/* 3. Real Cursor-Responsive Particle Interaction Canvas Overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />
    </div>
  );
}
