import React, { useEffect, useRef } from "react";
import "./DataGridHero.css";

interface DataGridHeroProps {
  rows?: number;
  cols?: number;
  spacing?: number;
  duration?: number;
  color?: string;
  animationType?: "pulse" | "wave" | "random";
  pulseEffect?: boolean;
  mouseGlow?: boolean;
  opacityMin?: number;
  opacityMax?: number;
  background?: string;
  children?: React.ReactNode;
}

export const DataGridHero: React.FC<DataGridHeroProps> = ({
  rows = 15,
  cols = 30,
  spacing = 2,
  duration = 2,
  color = "rgba(99, 102, 241, 0.4)",
  animationType = "wave",
  pulseEffect = true,
  mouseGlow = true,
  opacityMin = 0.05,
  opacityMax = 0.4,
  background = "#0f172a",
  children,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  // Build grid cells on cfg change
  useEffect(() => {
    const container = gridRef.current;
    if (!container) return;

    container.innerHTML = "";
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    container.style.gap = `${spacing}px`;
    container.style.setProperty("--mouse-glow-opacity", mouseGlow ? "1" : "0");

    const total = rows * cols;
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);

    for (let i = 0; i < total; i++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.style.backgroundColor = color;
      cell.style.setProperty("--opacity-min", opacityMin.toString());
      cell.style.setProperty("--opacity-max", opacityMax.toString());

      if (pulseEffect) {
        let delay;
        const r = Math.floor(i / cols);
        const c = i % cols;

        if (animationType === "wave") {
          delay = (r + c) * 0.1;
        } else if (animationType === "random") {
          delay = Math.random() * duration;
        } else {
          const dr = Math.abs(r - centerRow);
          const dc = Math.abs(c - centerCol);
          delay = Math.sqrt(dr * dr + dc * dc) * 0.2;
        }

        cell.style.animation = `cell-pulse ${duration}s infinite alternate`;
        cell.style.animationDelay = `${delay.toFixed(3)}s`;
      }

      container.appendChild(cell);
    }
  }, [
    rows,
    cols,
    spacing,
    color,
    animationType,
    pulseEffect,
    duration,
    opacityMin,
    opacityMax,
    mouseGlow,
  ]);

  // Mouse-follow glow
  useEffect(() => {
    if (!mouseGlow || !gridRef.current) return;
    const handler = (e: MouseEvent) => {
      if (!gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gridRef.current.style.setProperty("--mouse-x", `${x}px`);
      gridRef.current.style.setProperty("--mouse-y", `${y}px`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseGlow]);

  return (
    <div className="data-grid-hero" style={{ background }}>
      <div ref={gridRef} className="grid-container" aria-hidden="true" />
      <div className="hero-content" role="region" aria-label="Hero Content">
        {children}
      </div>
    </div>
  );
};
