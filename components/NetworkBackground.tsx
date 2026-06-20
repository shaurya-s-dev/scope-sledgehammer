"use client";
import { useEffect, useRef } from "react";

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  r: number; phase: number; speed: number;
  ci: number;           // color index
}

const C = ["0,255,255", "255,0,255", "0,200,200"] as const;

export default function NetworkBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let nodes: Node[] = [];
    const N = 48;
    const MAX_D = 170;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const spawn = () => {
      nodes = Array.from({ length: N }, (_, i) => ({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        r:  Math.random() * 1.4 + 0.7,
        phase: Math.random() * Math.PI * 2,
        speed: 0.011 + Math.random() * 0.017,
        ci: i % C.length,
      }));
    };

    resize();
    spawn();
    const onResize = () => { resize(); spawn(); };
    window.addEventListener("resize", onResize);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // move & wrap
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.phase += n.speed;
        if (n.x < -12) n.x = canvas.width  + 12;
        if (n.x > canvas.width  + 12) n.x = -12;
        if (n.y < -12) n.y = canvas.height + 12;
        if (n.y > canvas.height + 12) n.y = -12;
      });

      // edges
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d  = Math.hypot(dx, dy);
          if (d < MAX_D) {
            const a = (1 - d / MAX_D) * 0.08;
            const c = C[(nodes[i].ci + nodes[j].ci) % C.length];
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${c},${a})`;
            ctx.lineWidth = 0.55;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // nodes
      nodes.forEach(n => {
        const p = Math.sin(n.phase);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + p * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${C[n.ci]},${0.16 + p * 0.09})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    };

    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}