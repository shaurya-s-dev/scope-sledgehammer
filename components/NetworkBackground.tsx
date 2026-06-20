"use client";
import { useEffect, useRef } from "react";

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = 25; // 20-30 particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      decay: number;
      isMagenta: boolean;
    }
    const particles: Particle[] = [];

    const initParticle = (p: Partial<Particle> = {}, randomY = false): Particle => {
      p.x = Math.random() * width;
      p.y = randomY ? Math.random() * height : height + 10;
      p.vx = (Math.random() - 0.5) * 0.25;
      p.vy = -Math.random() * 0.4 - 0.15; // Slow upward drift
      p.radius = Math.random() * 2 + 1.2;
      p.alpha = randomY ? Math.random() * 0.8 + 0.2 : 1.0;
      p.decay = Math.random() * 0.003 + 0.0015;
      p.isMagenta = Math.random() > 0.5;
      return p as Particle;
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(initParticle({}, true));
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const isTerminal = typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "terminal";

      // Draw particles (No distance line connection logic)
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        // Reset particle when it fades out or drifts off-screen
        if (p.alpha <= 0 || p.y < -10 || p.x < -10 || p.x > width + 10) {
          initParticle(p, false);
        }

        const alphaVal = Math.max(0, Math.min(1, p.alpha));
        if (isTerminal) {
          ctx.fillStyle = `rgba(0, 255, 0, ${alphaVal * 0.45})`;
        } else {
          ctx.fillStyle = p.isMagenta
            ? `rgba(255, 0, 255, ${alphaVal * 0.45})`
            : `rgba(0, 255, 255, ${alphaVal * 0.45})`;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}