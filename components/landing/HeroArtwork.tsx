"use client";

import React, { useEffect, useRef } from "react";

type DisintegrationParticle = {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  width: number;
  height: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  type: "shard" | "fiber" | "glyph" | "dust";
  glyph?: string;
};

type AmbientParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  phase: number;
};

const GLYPHS = ["{", "}", "<", ">", ";", "/", "=>", "git", "0x", "1", "0", ":"];

const SHARD_COLORS = [
  "#10234A", // Deep navy
  "#1E3A8A", // Navy blue
  "#1D4ED8", // Cobalt
  "#245DFF", // Resummit primary blue
  "#3B82F6", // Bright blue
  "#60A5FA", // Sky blue
  "#BFDBFE", // Pale blue
  "#FFFFFF", // Pure white
  "#CBD5E1", // Chrome / silver
];

const FIBER_COLORS = [
  "#FFFFFF",
  "#F8FAFC",
  "#E2E5EB",
  "#CBD5E1",
  "#94A3B8",
];

export default function HeroArtwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animId: number;
    let width = (canvas.width = container.offsetWidth);
    let height = (canvas.height = container.offsetHeight);

    // Load hero artwork image
    const img = new Image();
    img.src = "/images/hero_transformation.png";

    // Offscreen mask canvas for organic disintegration cutouts
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext("2d");

    // Offscreen sampling canvas to sample pixel colors directly from image
    const sampleCanvas = document.createElement("canvas");
    sampleCanvas.width = 400;
    sampleCanvas.height = 224;
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });

    let isImgReady = false;
    const onImgLoad = () => {
      isImgReady = true;
      if (sampleCtx) {
        sampleCtx.clearRect(0, 0, sampleCanvas.width, sampleCanvas.height);
        sampleCtx.drawImage(img, 0, 0, sampleCanvas.width, sampleCanvas.height);
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      onImgLoad();
    } else {
      img.onload = onImgLoad;
    }

    const handleResize = () => {
      if (!container || !canvas || !maskCanvas) return;
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
      maskCanvas.width = width;
      maskCanvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    // Bounded Particle Object Pool (320 particles max)
    const MAX_PARTICLES = 320;
    const particles: DisintegrationParticle[] = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 3,
        width: 4,
        height: 4,
        color: "#245DFF",
        alpha: 1,
        decay: 0.012,
        rotation: 0,
        vRot: 0,
        type: "shard",
      });
    }

    // Subtle ambient particles (8 particles drifting at rest)
    const AMBIENT_COUNT = 8;
    const ambientParticles: AmbientParticle[] = [];
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      ambientParticles.push({
        x: Math.random() * width,
        y: height * 0.3 + Math.random() * (height * 0.4),
        vx: 0.3 + Math.random() * 0.4,
        vy: (Math.random() - 0.5) * 0.2,
        size: 1.5 + Math.random() * 2,
        color: Math.random() > 0.4 ? "#245DFF" : "#60A5FA",
        alpha: 0.2 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Calculate image render bounds inside canvas
    const getImageBounds = () => {
      const maxW = Math.min(width, 1560);
      const maxH = Math.min(height, 460);
      const imgAspect = 1376 / 768; // source image aspect ratio ~1.79

      let renderW = maxW;
      let renderH = maxW / imgAspect;
      if (renderH > maxH) {
        renderH = maxH;
        renderW = renderH * imgAspect;
      }

      const imgX = (width - renderW) / 2;
      const imgY = (height - renderH) / 2;
      return { imgX, imgY, renderW, renderH };
    };

    // Sample color from the visible artwork at canvas (cx, cy)
    const sampleArtworkColor = (
      cx: number,
      cy: number,
      imgBounds: { imgX: number; imgY: number; renderW: number; renderH: number }
    ): string => {
      const { imgX, imgY, renderW, renderH } = imgBounds;
      const relX = cx - imgX;
      const relY = cy - imgY;
      const xFraction = Math.max(0, Math.min(1, relX / (renderW || 1)));

      if (sampleCtx && sampleCanvas.width > 0 && relX >= 0 && relX < renderW && relY >= 0 && relY < renderH) {
        const sx = Math.floor((relX / renderW) * sampleCanvas.width);
        const sy = Math.floor((relY / renderH) * sampleCanvas.height);
        try {
          const pixel = sampleCtx.getImageData(sx, sy, 1, 1).data;
          if (pixel[3] > 30) {
            return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
          }
        } catch {
          // fall through
        }
      }

      if (xFraction < 0.45) {
        return SHARD_COLORS[Math.floor(Math.random() * SHARD_COLORS.length)];
      } else if (xFraction < 0.72) {
        return Math.random() > 0.4 ? "#245DFF" : "#1D4ED8";
      } else {
        return FIBER_COLORS[Math.floor(Math.random() * FIBER_COLORS.length)];
      }
    };

    // Spawn a burst of disintegration particles at (x, y)
    const spawnDisintegrationFragments = (
      x: number,
      y: number,
      count: number,
      pvx: number,
      pvy: number,
      imgBounds: { imgX: number; imgY: number; renderW: number; renderH: number }
    ) => {
      if (prefersReducedMotion) return;

      const pSpeed = Math.sqrt(pvx * pvx + pvy * pvy);
      const normX = pSpeed > 0.1 ? -pvy / pSpeed : 0;
      const normY = pSpeed > 0.1 ? pvx / pSpeed : 0;
      const xFraction = (x - imgBounds.imgX) / (imgBounds.renderW || 1);

      let spawned = 0;
      for (let i = 0; i < MAX_PARTICLES; i++) {
        const p = particles[i];
        if (!p.active) {
          p.active = true;

          // Organic jitter around cursor
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 32;
          const px = x + Math.cos(angle) * dist;
          const py = y + Math.sin(angle) * dist;

          p.x = px;
          p.y = py;
          p.color = sampleArtworkColor(px, py, imgBounds);

          // Randomize fragment type for cinematic texture
          const randType = Math.random();
          if (randType < 0.40) {
            // Sharp rectangular/square shard (code chips / glass)
            p.type = "shard";
            p.width = 3.5 + Math.random() * 5.5;
            p.height = 3.0 + Math.random() * 5.0;
            p.size = (p.width + p.height) / 2;
            p.decay = 0.009 + Math.random() * 0.013;
          } else if (randType < 0.65) {
            // Elongated document fiber (shredded resume paper)
            p.type = "fiber";
            p.width = 1.8 + Math.random() * 1.6;
            p.height = 8.0 + Math.random() * 11.0;
            p.size = p.height;
            p.decay = 0.008 + Math.random() * 0.012;
            if (xFraction > 0.65) {
              p.color = Math.random() > 0.4 ? "#FFFFFF" : "#E2E5EB";
            }
          } else if (randType < 0.85) {
            // Code glyph fragment ({, }, ;, /, git)
            p.type = "glyph";
            p.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            p.size = 9 + Math.random() * 4;
            p.decay = 0.007 + Math.random() * 0.010;
          } else {
            // Micro fine dust grain (dissolving particulate)
            p.type = "dust";
            p.size = 1.6 + Math.random() * 2.2;
            p.width = p.size;
            p.height = p.size;
            p.decay = 0.010 + Math.random() * 0.015;
          }

          // Directional velocity: outward from cursor + cursor impulse + natural turbulence
          const outDirX = Math.cos(angle);
          const outDirY = Math.sin(angle);
          const swirl = (Math.random() - 0.5) * 2.4;
          const impulse = 1.6 + Math.random() * 3.2;

          p.vx = outDirX * impulse + normX * swirl + pvx * 0.12;
          p.vy = outDirY * impulse + normY * swirl + pvy * 0.12 - 0.7; // gentle buoyancy
          p.alpha = 0.90 + Math.random() * 0.10;
          p.rotation = Math.random() * Math.PI * 2;
          p.vRot = (Math.random() - 0.5) * 0.24;

          spawned++;
          if (spawned >= count) break;
        }
      }
    };

    let isPointerInside = false;
    let pointerX = -9999;
    let pointerY = -9999;
    let pointerVx = 0;
    let pointerVy = 0;
    let prevPointerX = -9999;
    let prevPointerY = -9999;

    const stampDisintegration = (x: number, y: number, radMultiplier = 1.0) => {
      if (!maskCtx) return;
      maskCtx.save();
      maskCtx.globalCompositeOperation = "source-over";

      const dabs = 6;
      for (let d = 0; d < dabs; d++) {
        const rad = (32 + Math.random() * 34) * radMultiplier;
        const jx = x + (Math.random() - 0.5) * 44;
        const jy = y + (Math.random() - 0.5) * 44;

        const grad = maskCtx.createRadialGradient(jx, jy, rad * 0.15, jx, jy, rad);
        grad.addColorStop(0, "rgba(0, 0, 0, 1.0)");
        grad.addColorStop(0.65, "rgba(0, 0, 0, 0.85)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        maskCtx.fillStyle = grad;
        maskCtx.beginPath();
        maskCtx.arc(jx, jy, rad, 0, Math.PI * 2);
        maskCtx.fill();
      }
      maskCtx.restore();
    };

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
      pointerX = x;
      pointerY = y;
      pointerVx = pvx;
      pointerVy = pvy;
      isPointerInside = true;

      const imgBounds = getImageBounds();

      // Check if pointer is on or near the artwork horizontal & vertical bounds
      const inBounds =
        x >= imgBounds.imgX - 40 &&
        x <= imgBounds.imgX + imgBounds.renderW + 40 &&
        y >= imgBounds.imgY - 40 &&
        y <= imgBounds.imgY + imgBounds.renderH + 40;

      if (inBounds) {
        stampDisintegration(x, y, 1.0);
        const count = Math.min(16, Math.max(6, Math.floor(speed / 3) + 4));
        spawnDisintegrationFragments(x, y, count, pvx, pvy, imgBounds);
      }
    };

    const onPointerEnter = (e: PointerEvent) => {
      isPointerInside = true;
      const rect = container.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      prevPointerX = pointerX;
      prevPointerY = pointerY;
    };

    const onPointerLeave = () => {
      isPointerInside = false;
      prevPointerX = -9999;
      prevPointerY = -9999;
      pointerX = -9999;
      pointerY = -9999;
    };

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerenter", onPointerEnter, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave, { passive: true });
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerenter", onPointerEnter, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave, { passive: true });

    // IntersectionObserver to pause rendering when hero is off-screen
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    let frameCount = 0;

    // Animation Loop
    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      frameCount++;
      ctx.clearRect(0, 0, width, height);

      const imgBounds = getImageBounds();

      // If pointer is hovering inside the artwork, keep disintegrating directly beneath the cursor
      if (isPointerInside && pointerX !== -9999) {
        const inBounds =
          pointerX >= imgBounds.imgX - 30 &&
          pointerX <= imgBounds.imgX + imgBounds.renderW + 30 &&
          pointerY >= imgBounds.imgY - 30 &&
          pointerY <= imgBounds.imgY + imgBounds.renderH + 30;

        if (inBounds) {
          stampDisintegration(pointerX, pointerY, 0.85);
          // Continuous gentle stream of fragments while hovering
          if (frameCount % 3 === 0) {
            spawnDisintegrationFragments(pointerX, pointerY, 3, pointerVx * 0.5, pointerVy * 0.5, imgBounds);
          }
        }
      }

      // 1. Heal the disintegration mask gradually
      if (maskCtx) {
        maskCtx.save();
        maskCtx.globalCompositeOperation = "destination-out";
        // When pointer is inside, heal slightly slower; when left, heal smoothly over ~30 frames
        maskCtx.fillStyle = isPointerInside ? "rgba(0, 0, 0, 0.025)" : "rgba(0, 0, 0, 0.048)";
        maskCtx.fillRect(0, 0, width, height);
        maskCtx.restore();
      }

      // 2. Render base artwork with disintegration cutouts
      if (isImgReady || (img.complete && img.naturalWidth > 0)) {
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(img, imgBounds.imgX, imgBounds.imgY, imgBounds.renderW, imgBounds.renderH);

        // Apply disintegration mask:
        // Wherever mask has been stamped by the cursor, the artwork dissolves away into transparent background!
        ctx.globalCompositeOperation = "destination-out";
        ctx.drawImage(maskCanvas, 0, 0, width, height);
        ctx.restore();
      }

      // 3. Render flying disintegration fragments
      ctx.save();
      ctx.globalCompositeOperation = "source-over";

      for (let i = 0; i < MAX_PARTICLES; i++) {
        const p = particles[i];
        if (!p.active) continue;

        // Particle physics
        p.vx *= 0.955;
        p.vy *= 0.955;
        p.vy -= 0.015; // gentle buoyant curl
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

        if (p.type === "shard") {
          // Sharp rectangular chip of code/glass
          ctx.beginPath();
          ctx.rect(-p.width / 2, -p.height / 2, p.width, p.height);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 4;
          ctx.fill();
        } else if (p.type === "fiber") {
          // Thin document paper strip
          ctx.beginPath();
          ctx.rect(-p.width / 2, -p.height / 2, p.width, p.height);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (p.type === "glyph" && p.glyph) {
          // Monospace code glyph ({, }, ;, /, git)
          ctx.font = "bold 9px monospace";
          ctx.fillStyle = p.color;
          ctx.fillText(p.glyph, -4, 3);
        } else {
          // Fine glowing dust grain
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        ctx.restore();
      }

      // 4. Subtle ambient particles drifting along the stream at rest
      for (let a = 0; a < AMBIENT_COUNT; a++) {
        const amb = ambientParticles[a];
        amb.x += amb.vx;
        amb.y += Math.sin(amb.phase) * 0.35 + amb.vy;
        amb.phase += 0.03;

        if (amb.x > width + 20) {
          amb.x = -20;
          amb.y = height * 0.3 + Math.random() * (height * 0.4);
        }

        ctx.save();
        ctx.globalAlpha = amb.alpha;
        ctx.beginPath();
        ctx.arc(amb.x, amb.y, amb.size, 0, Math.PI * 2);
        ctx.fillStyle = amb.color;
        ctx.shadowColor = amb.color;
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerenter", onPointerEnter);
      canvas.removeEventListener("pointerleave", onPointerLeave);
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
        height: "clamp(380px, 40vw, 460px)",
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
          color: "rgba(21, 26, 36, 0.035)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        CAREER
      </div>

      {/* 2. Cinematic Disintegration Canvas (Renders Art + Organic Dissolving Holes + Flying Fragments) */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
          zIndex: 3,
          pointerEvents: "auto",
        }}
      />
    </div>
  );
}
