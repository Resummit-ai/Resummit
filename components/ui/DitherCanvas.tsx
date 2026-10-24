"use client";

import React, { useEffect, useRef } from "react";

interface DitherCanvasProps {
  imageSrc: string;
  theme?: "light" | "dark";
  className?: string;
  pixelSize?: number;
}

const BAYER_8X8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

export function DitherCanvas({
  imageSrc,
  theme = "light",
  className = "",
  pixelSize = 3,
}: DitherCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    const renderDither = () => {
      if (!isMounted || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      if (width === 0 || height === 0) return;

      canvas.width = width;
      canvas.height = height;

      // Offscreen low-res canvas for pixelation
      const scale = 1 / pixelSize;
      const lowW = Math.max(1, Math.floor(width * scale));
      const lowH = Math.max(1, Math.floor(height * scale));

      const offCanvas = document.createElement("canvas");
      offCanvas.width = lowW;
      offCanvas.height = lowH;
      const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      // Draw image object-cover style into low-res canvas
      const imgRatio = img.naturalWidth / (img.naturalHeight || 1);
      const canvasRatio = lowW / lowH;
      let drawW = lowW;
      let drawH = lowH;
      let drawX = 0;
      let drawY = 0;

      if (canvasRatio > imgRatio) {
        drawH = lowW / imgRatio;
        drawY = (lowH - drawH) * 0.35; // Position focus at mountain peaks
      } else {
        drawW = lowH * imgRatio;
        drawX = (lowW - drawW) * 0.5;
      }

      offCtx.drawImage(img, drawX, drawY, drawW, drawH);
      const imgData = offCtx.getImageData(0, 0, lowW, lowH);
      const data = imgData.data;

      const isLight = theme === "light";
      // Apply Bayer 8x8 ordered dithering across color channels to preserve rich mountain tones
      const spread = isLight ? 36 : 44;
      const steps = isLight ? 8 : 6; // 8 tonal quantization levels for light mode
      const stepSize = 255 / (steps - 1);

      for (let y = 0; y < lowH; y++) {
        for (let x = 0; x < lowW; x++) {
          const idx = (y * lowW + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          const dither = (BAYER_8X8[y % 8][x % 8] / 64 - 0.5) * spread;

          const rAdj = Math.max(0, Math.min(255, r + dither));
          const gAdj = Math.max(0, Math.min(255, g + dither));
          const bAdj = Math.max(0, Math.min(255, b + dither));

          data[idx] = Math.round(Math.round(rAdj / stepSize) * stepSize);
          data[idx + 1] = Math.round(Math.round(gAdj / stepSize) * stepSize);
          data[idx + 2] = Math.round(Math.round(bAdj / stepSize) * stepSize);
        }
      }

      offCtx.putImageData(imgData, 0, 0);

      // Upscale with crisp pixelated rendering
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offCanvas, 0, 0, width, height);
    };

    img.onload = renderDither;
    if (img.complete) {
      renderDither();
    }

    const handleResize = () => {
      renderDither();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
    };
  }, [imageSrc, theme, pixelSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full pointer-events-none ${className}`}
      style={{ imageRendering: "pixelated" }}
      aria-hidden="true"
    />
  );
}
