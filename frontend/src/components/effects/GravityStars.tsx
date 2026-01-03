"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme/ThemeProvider";

interface GravityStarsProps {
  starsCount?: number;
  starsSize?: number;
  movementSpeed?: number;
  mouseInfluence?: number;
  gravityStrength?: number;
  mouseGravity?: "attract" | "repel";
}

export function GravityStars({
  starsCount = 80,
  starsSize = 2.5,
  movementSpeed = 0.8,
  mouseInfluence = 120,
  gravityStrength = 85,
  mouseGravity = "attract",
}: GravityStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const mouse = { x: width / 2, y: height / 2 };
    const stars: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    // Theme-based colors
    const isDark = theme === "dark";
    const starColor = isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.7)";
    const glowColor = isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.4)";

    // Initialize stars
    for (let i = 0; i < starsCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * movementSpeed,
        vy: (Math.random() - 0.5) * movementSpeed,
        size: Math.random() * starsSize + 0.5,
      });
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        // Calculate distance to mouse
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Apply gravity with your strength value
        if (distance < mouseInfluence && distance > 0) {
          const force = ((mouseInfluence - distance) / mouseInfluence) * (gravityStrength / 100);
          const angle = Math.atan2(dy, dx);
          const forceMultiplier = mouseGravity === "repel" ? -1 : 1;
          star.vx += Math.cos(angle) * force * 0.1 * forceMultiplier;
          star.vy += Math.sin(angle) * force * 0.1 * forceMultiplier;
        }

        // Update position
        star.x += star.vx;
        star.y += star.vy;

        // Apply friction (less friction for smoother movement)
        star.vx *= 0.98;
        star.vy *= 0.98;

        // Wrap around edges
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Draw star with theme-based color
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = starColor;
        ctx.shadowBlur = 15;
        ctx.shadowColor = glowColor;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [starsCount, starsSize, movementSpeed, mouseInfluence, gravityStrength, mouseGravity, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        mixBlendMode: theme === "dark" ? "screen" : "multiply",
      }}
    />
  );
}
