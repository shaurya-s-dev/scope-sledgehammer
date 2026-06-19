"use client";
import { useEffect, useState, useRef } from "react";
import { BarChart3, Zap, TrendingUp, HeartCrack, Activity } from "lucide-react";

interface Props {
  inputLength: number;
  ticketCount: number;
  phase: string;
  brutalityLevel: string;
  events?: string[];
}

export default function NovusDashboard({ inputLength, ticketCount, phase, brutalityLevel, events }: Props) {
  const [scopeScore, setScopeScore] = useState(0);
  const [featuresVaporized, setFeaturesVaporized] = useState(0);
  const [timeSaved, setTimeSaved] = useState(0);
  const [tearsSaved, setTearsSaved] = useState(0);

  const prevPhaseRef = useRef<string>("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase === "revealed" && prevPhaseRef.current === "loading" && ticketCount > 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Calculate final target metrics based on input and tickets
      const targetScore = Math.min(98, Math.max(65, Math.round(98 - (ticketCount * 8) + (inputLength / 100))));
      const targetFeatures = Math.min(150, Math.max(12, Math.round(inputLength / 8)));
      const targetTime = Math.min(36, Math.max(4, Math.round(inputLength / 35)));
      const targetTears = Math.min(25000, Math.max(2500, Math.round(inputLength * 15)));

      const steps = 30; // 30 frames animation
      let step = 0;

      intervalRef.current = setInterval(() => {
        step++;
        setScopeScore(Math.round((targetScore * step) / steps));
        setFeaturesVaporized(Math.round((targetFeatures * step) / steps));
        setTimeSaved(Math.round((targetTime * step) / steps));
        setTearsSaved(Math.round((targetTears * step) / steps));

        if (step >= steps) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 30); // count up animation over ~900ms
    } else if (phase === "idle") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Defer state reset to avoid synchronous setState inside useEffect
      setTimeout(() => {
        setScopeScore(0);
        setFeaturesVaporized(0);
        setTimeSaved(0);
        setTearsSaved(0);
      }, 0);
    }
    prevPhaseRef.current = phase;
  }, [phase, ticketCount, inputLength]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Scroll to bottom when new logs are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [events, phase]);

  const logMessages: string[] = [];

  if (phase === "loading") {
    logMessages.push("[SYSTEM]: Repository mapping initialized...");
    logMessages.push("[SYSTEM]: Isolating high-risk structural bottlenecks...");
    logMessages.push("[SYSTEM]: Brutality level set to " + brutalityLevel.toUpperCase());
  }
  if (phase === "revealed") {
    logMessages.push("[SYSTEM]: " + ticketCount + " ticket(s) generated.");
    logMessages.push("[SYSTEM]: MVP value architecture locked.");
    logMessages.push("[SYSTEM]: Estimated time-to-ship saved: " + timeSaved + " weeks.");
  }

  // Prepend static messages and append dynamic event logs
  const combinedLogs = events ? [...logMessages, ...events] : logMessages;

  return (
    <div style={{ marginTop: 40, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", padding: "20px" }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#3F3F46", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <Activity size={12} color="#00FFFF" />
        Sledgehammer Impact Stats
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FFFF", boxShadow: "0 0 8px #00FFFF", animation: "blink 1.5s ease-in-out infinite" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
        {[
          { label: "Scope Optimization Score", value: `${scopeScore}%`, icon: BarChart3, color: "#00FFFF" },
          { label: "Features Vaporized", value: featuresVaporized.toString(), icon: Zap, color: "#FF00FF" },
          { label: "Time-to-Ship Saved", value: `${timeSaved} Weeks`, icon: TrendingUp, color: "#00FFFF" },
          { label: "Stakeholder Tears Saved", value: tearsSaved.toLocaleString(), icon: HeartCrack, color: "#FF00FF" },
        ].map((metric, i) => (
          <div key={i} style={{ background: "rgba(15,15,18,0.6)", border: `1px solid ${metric.color}22`, padding: "12px", transition: "all 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <metric.icon size={12} color={metric.color} />
              <span style={{ fontSize: 9, textTransform: "uppercase", color: "#52525B", letterSpacing: "0.1em" }}>{metric.label}</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: metric.color, textShadow: `0 0 12px ${metric.color}44` }}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      {combinedLogs.length > 0 && (
        <div 
          ref={logContainerRef}
          style={{ 
            marginTop: 20, 
            borderTop: "1px solid rgba(255,255,255,0.04)", 
            paddingTop: 16,
            maxHeight: 110,
            overflowY: "auto",
            scrollbarWidth: "none"
          }}
        >
          {combinedLogs.map((msg, i) => (
            <div key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#52525B", letterSpacing: "0.05em", marginBottom: 6, opacity: 0.8 }}>
              {msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
